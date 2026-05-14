# ADR 005: Dynamic `$typeName` via Static Getters

## Status

Accepted

## Context

ADR-003 introduced runtime environment switching: `setActiveEnv()` flips a
module-level slot that resolvers like `getTypeOrigin()` and `getPublishedAt()`
read on each call. Function-binding `target` strings interpolate
`getPublishedAt(...)` at PTB-build time, so they follow env switches correctly.

Generated struct and enum classes also carry their fully-qualified Move type
name. Originally this was emitted as a `static readonly` field whose value was
computed at class-load time:

```ts
export class Section implements StructClass {
  static readonly $typeName: `${string}::piecewise::Section` = `${
    getTypeOrigin('my-app', 'piecewise::Section')
  }::piecewise::Section` as const
  // ...
}
```

The right-hand side of a `static readonly` initializer runs once, when the
class is first loaded — and the auto-init in `_envs/index.ts` calls
`setActiveEnv('<default>')` before any user code runs. So every Dynamic-package
`$typeName` was frozen against whichever env was the default at import time
(typically mainnet), regardless of any later `setActiveEnv()` call.

This caused real bugs:

```ts
import { setActiveEnv } from './gen/_envs'
import { create as piecewiseCreate } from './gen/my-app/piecewise/functions'

setActiveEnv('local')

const tx = new Transaction()
piecewiseCreate(tx, { /* ... */ sections: [...] })
//  → tx.moveCall.target   = '0xLOCAL::piecewise::create' (correct — runtime)
//  → vector<Section> type = '0xMAINNET::piecewise::Section' (wrong — frozen)
//  → dry-run fails: "Dependent package not found on-chain"
```

The leak compounds through reified handles. Code that stores a reified handle
across an env switch — common in SDK builders that cache `this.r = Foo.r(...)`
in constructors or in module-level constants — also reads stale identity
strings, because the reified return object's `typeName` / `fullTypeName` /
`typeArgs` fields were plain values captured at the moment `reified()` was
called. `phantom(reified)` had the same issue: it stored `reified.fullTypeName`
into `phantomType` as a snapshot, which `extractType()` then read.

`std` and `sui` types weren't affected — their addresses are constant on every
chain (`0x1`, `0x2`), so the frozen value happens to always be correct.

## Decision

Make `$typeName` read the active env on every access for non-system packages,
and propagate the same lazy-read pattern through every site that captures it.
Four changes, all backward compatible at every read site:

### 1. Struct/enum `$typeName` becomes a getter for Dynamic packages

```ts
// Before
static readonly $typeName: `${string}::piecewise::Section` = `${
  getTypeOrigin('my-app', 'piecewise::Section')
}::piecewise::Section` as const

// After
static get $typeName(): `${string}::piecewise::Section` {
  return `${getTypeOrigin('my-app', 'piecewise::Section')}::piecewise::Section` as const
}
```

System packages (std at `0x1`, sui at `0x2`) keep `static readonly`. Their
addresses are constant across chains, and the literal-typed field preserves
precise template-literal type narrowing (e.g.
`` `0x2::balance::Balance` `` rather than `` `${string}::balance::Balance` ``).

### 2. Enum variant `$typeName` delegates via a getter

```ts
// Before
static readonly $typeName: typeof Action.$typeName = Action.$typeName

// After
static get $typeName(): typeof Action.$typeName { return Action.$typeName }
```

Variant classes used to read the enum's `$typeName` at class-load time. Even
after fix 1 made the enum dynamic, variants would re-freeze on first variant
class load. A delegating getter forwards each read through to the (now dynamic)
enum getter.

### 3. `reified()` identity fields become object-literal getters

```ts
static reified(): SectionReified {
  return {
    get typeName() { return Section.$typeName },
    get fullTypeName() {
      return composeSuiType(Section.$typeName, ...[]) as `${string}::piecewise::Section`
    },
    typeArgs: [] as [],
    // ...
  }
}
```

For structs with type parameters, `typeArgs` is also a getter (its
`extractType(...)` calls reach through reified handles whose own
`fullTypeName` is now dynamic):

```ts
get typeArgs() {
  return [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>]
}
```

This is what makes stored reified handles (e.g. `this.r =
SupplyPool_.r(args.T.r, args.ST.r)`, or module-level
`Position_.r(USDC.p, SUI.p)` constants) follow env switches: subsequent reads
of `stored.typeName` / `stored.fullTypeName` / `stored.typeArgs` re-resolve
each time.

### 4. `phantom(reifiedHandle).phantomType` is a getter

```ts
// Before
return { phantomType: type.fullTypeName, kind: 'PhantomReified' }

// After
return {
  get phantomType() { return type.fullTypeName },
  kind: 'PhantomReified',
}
```

The recursion is then end-to-end: `PhantomReified.phantomType` → reified
handle's `fullTypeName` getter → struct's `$typeName` getter →
`getTypeOrigin(...)` → active env. `phantom(stringLiteral)` stays a plain
field (the input was already a finalized string; nothing to keep live).

The `PhantomReified.phantomType` interface field is also marked `readonly` —
it should have been from the start, and the getter implementation requires it
to be readable but not assignable.

## Rationale

### Why getter, not method

A method (`Foo.typeName(env?)`) would let callers pass an explicit env per
call, which would be cleaner for the eventual per-instance facade design
(see *Future* below). It also has a downside: every existing read site has
to migrate from
property access (`Foo.$typeName`, `${Foo.$typeName}`) to method invocation
(`Foo.typeName()`, `${Foo.typeName()}`). That's invasive both in generated
code (BCS template names, JSON validation, type guards) and in consumer code.

A getter keeps property-access syntax everywhere unchanged. Every read site —
generated and user code — continues to work without modification, and just
starts reflecting the active env on each access. The trade-off (no explicit
per-call env parameter on the static surface) is intentional and recovered
later when the design moves to a per-instance facade.

### Why preserve `static readonly` for system packages

The motivating bug only exists for packages whose address depends on the env.
System packages don't change across chains, so the freeze is benign. Keeping
`static readonly ... as const` for them:

- Preserves the precise literal type (`` `0x2::balance::Balance` `` rather
  than `` `${string}::balance::Balance` ``) for any consumer doing
  type-narrowed string operations.
- Avoids an unnecessary getter invocation on every read.

The conditional gate is the only place in the emission templates where
`PackageInfo::System` vs `PackageInfo::Dynamic` is observed. A
`make_system_struct_ir()` / `make_system_enum_ir()` snapshot fixture pins this
so a future refactor can't silently turn `static readonly` into a getter for
system types.

### Why also fix the reified return object and `phantom()`

The reported bug surfaced through `vector<Section>` type-arg strings, which
read `Section.$typeName` at PTB-build time. Fix #1 alone is enough for that
specific failure mode.

But the broader pattern in SDKs that wrap the generated output is to store
reified handles as long-lived state:

```ts
// In an SDK wrapping the generated bindings
this.r = SupplyPool_.r(args.T.r, args.ST.r)
// ...later, on every PTB method:
addLendFacil(tx, this.r.typeArgs, { ... })
```

The handle is captured under one env, the methods called under another. Fix
#3 (object-literal getters in reified) and Fix #4 (lazy `phantomType` in
`phantom()`) make stored handles read live. Without them, the reported bug
would persist via the reified-handle path even though the direct `$typeName`
read is fixed.

### Why the `phantom(string)` branch stays a snapshot

`phantom(reified)` reads its argument's `fullTypeName` which is now a getter.
`phantom(stringLiteral)` receives an already-finalized string — there's
nothing to keep live. The asymmetry is intentional and pinned by a runtime
test.

### Snapshot semantics for *instances*

`new Foo([], fields)` continues to read `Foo.$typeName` once at construction
and freeze the result onto `this.$typeName`. This is correct: an instance
carries the identity it was decoded under, so `toJSON()` round-trips back to
the same `$typeName`. Decoding in env A and re-serializing in env B should
not silently relabel the instance.

The split is: **static surface and reified handles are dynamic; constructed
instances are snapshots.** Both are read through `Name.$typeName` (the
getter), so the read site is uniform; only the *capture site* differs.

## Consequences

### Positive

- **`setActiveEnv()` is honest end-to-end.** Every downstream `$typeName`
  read — vector/option PTB args, BCS template names, JSON discriminator
  checks, `composeSuiType` inputs, `PhantomReified` chains — reflects the
  current env.
- **No consumer code changes.** `Foo.$typeName`, `Foo.r(...).typeArgs`,
  `phantom(Foo.reified()).phantomType` all keep working unchanged. No call
  sites in generated code or user code need to migrate.
- **Stored reified handles work.** The pattern of caching
  `this.r = Foo.r(...)` in a higher-level SDK wrapper and reading
  `this.r.typeArgs` later survives env switches.
- **System types keep their literal narrowing.** Consumers that type-narrow
  on `Section.$typeName` still see the exact literal for std/sui types.

### Negative

- **Each access pays a small lookup.** A getter walks
  `getActiveEnv().packages[pkg].typeOrigins[path]` plus a template-literal
  build. Negligible at PTB-build time; the only path that's hot is decoding
  in tight loops, and BCS itself is already env-independent so it skips the
  getter.
- **Reference equality of array-typed fields changes.** `r.typeArgs ===
  r.typeArgs` was `true` (same array), is now `false` (new array per read).
  No realistic consumer relies on this; iteration/indexing/destructuring
  are unaffected.
- **Two parallel surfaces if a method form is added later.** When env
  becomes an explicit parameter (see *Future*), the getter form and the
  method form will coexist. Acceptable as a bridge; the method form will
  become the recommended API.
- **Still single-env-at-a-time.** The fix makes the global slot work
  correctly under switching, but two callers needing different envs
  concurrently still can't both be right. This is what the facade rework
  addresses.

## Future

The bridge approach assumes there is one current env at a time. The cleaner
long-term design eliminates the global env entirely:

- Generated function wrappers gain an optional `env?: EnvConfig` parameter
  threaded through every call (already shipped — see DOC.md "Per-Call
  Environment Override").
- Static class members (`$typeName`, decoder methods, `reified()`) gain an
  optional `env?` parameter alongside the getter form, so consumers can
  read against a specific env without flipping the global slot.
- A `new Sdk({ env })`-style facade owns env on its instance and routes
  `this.env` into every call. Multiple facade instances coexist with no
  global mutation.

Under that design, the getters from this ADR become the global-env fallback
path — still correct for direct-import consumers, but inert when env is
passed explicitly. Nothing here paints the redesign into a corner.

## Implementation

### Generator changes

| File | Change |
|------|--------|
| `generator/src/ts_gen/structs.rs` | `emit_static_type_name_decl()` helper emits `static readonly` for System or `static get` for Dynamic. `reified()` `typeName` / `fullTypeName` / `typeArgs` are object-literal getters. |
| `generator/src/ts_gen/enums.rs` | Same helper for both no-typeparam and typeparam enum factories. Variant classes' `static $typeName` is a delegating getter. Reified identity fields are object-literal getters. |
| `generator/framework/reified.ts` | `phantom(reifiedHandle)` returns a getter for `phantomType`. `PhantomReified.phantomType` marked `readonly`. |

### Test coverage

- **Rust snapshot tests** (`generator/tests/snapshot_tests.rs`): the existing
  Dynamic-package fixtures get the new emission shape. Two new System-package
  fixtures (`make_system_struct_ir`, `make_system_enum_ir`) pin the
  `static readonly` path with invariant assertions.
- **TypeScript runtime tests** (`ts/tests/type-name-env-switching.test.ts`):
  end-to-end coverage of `setActiveEnv()` behavior — Dynamic `$typeName`
  follows the active env, System stays constant, stored `reified()` handles
  reflect env changes, nested reified args propagate through `extractType`,
  `phantom(reified).phantomType` re-reads on each access, and
  `phantom(stringLiteral)` stays a snapshot.

## References

- `generator/src/ts_gen/structs.rs::emit_static_type_name_decl()` and the
  reified emission templates.
- `generator/src/ts_gen/enums.rs::emit_static_type_name_decl()` and the
  variant emission blocks.
- `generator/framework/reified.ts::phantom()`.
- `ts/tests/type-name-env-switching.test.ts` — runtime verification.
- ADR-003 — Multi-environment generation (origin of `setActiveEnv()`).
- DOC.md "Per-Call Environment Override" — current scope of per-call `env`
  and the path toward removing the global slot.
