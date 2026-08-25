/**
 * Structural mirrors of the generated `EnvConfig` / `PackageConfig`.
 *
 * The two generated trees (`tests/gen` and `examples/gen`) each ship their own copy of the
 * env module, so their `EnvConfig` types are distinct nominal imports even though the shapes
 * match. Declaring the shape here lets one helper serve both.
 */
interface PackageConfigLike {
  originalId: string
  publishedAt: string
  typeOrigins: Record<string, string>
}

export interface EnvConfigLike {
  packages: Record<string, PackageConfigLike>
  dependencies: Record<string, PackageConfigLike>
}

/**
 * How a package was published locally.
 *
 * A bare string is a package published once and never upgraded: `originalId`, `publishedAt`,
 * and every type origin collapse to that single address.
 */
export type PackageLocalization =
  | string
  | {
      /** Address of the first version — where types introduced in v1 originate. */
      originalId: string
      /** Address of the newest version — where move calls are dispatched. */
      publishedAt: string
      /**
       * Types introduced after v1, mapped to the address of the version that added them.
       * Anything not listed originates at `originalId`.
       */
      typeOriginOverrides?: Record<string, string>
    }

/**
 * Rewrite `base` so the named packages point at freshly published local addresses.
 *
 * The committed testnet config distinguishes three things that a from-scratch publish would
 * collapse into one: `originalId`, `publishedAt`, and per-type origins. Keeping them distinct
 * matters, because `$typeName` is built from a type's *defining* address while move calls
 * target `publishedAt` — a distinction that is invisible unless the package really has been
 * upgraded.
 *
 * Type-origin *keys* are preserved from the base config, so the set of known types still comes
 * from the committed configuration rather than being guessed at runtime.
 */
export function localizeEnv<T extends EnvConfigLike>(
  base: T,
  packages: Record<string, PackageLocalization>
): T {
  const merged: Record<string, PackageConfigLike> = { ...base.packages }

  for (const [name, localization] of Object.entries(packages)) {
    const prior = base.packages[name]
    if (!prior) {
      throw new Error(
        `localizeEnv: package '${name}' is not in the base env. ` +
          `Available: ${Object.keys(base.packages).join(', ') || '(none)'}`
      )
    }

    const spec =
      typeof localization === 'string'
        ? { originalId: localization, publishedAt: localization, typeOriginOverrides: {} }
        : { typeOriginOverrides: {}, ...localization }

    for (const key of Object.keys(spec.typeOriginOverrides)) {
      if (!(key in prior.typeOrigins)) {
        throw new Error(
          `localizeEnv: '${name}' has no type '${key}' to override the origin of. ` +
            `The generated config and the fixture sources have drifted apart.`
        )
      }
    }

    merged[name] = {
      originalId: spec.originalId,
      publishedAt: spec.publishedAt,
      typeOrigins: Object.fromEntries(
        Object.keys(prior.typeOrigins).map(k => [k, spec.typeOriginOverrides[k] ?? spec.originalId])
      ),
    }
  }

  return { ...base, packages: merged }
}
