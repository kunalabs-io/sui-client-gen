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
 * Rewrite `base` so the named packages point at freshly published local addresses.
 *
 * A package published to a fresh genesis has never been upgraded, which collapses the three
 * addresses the committed testnet config distinguishes: `originalId`, `publishedAt`, and every
 * entry in `typeOrigins` all become the new package ID. (On testnet they differ — `examples`
 * has been upgraded, so its types originate across two different addresses depending on which
 * version introduced them.)
 *
 * Type-origin *keys* are preserved from the base config, so the set of known types still comes
 * from the committed configuration rather than being guessed at runtime.
 */
export function localizeEnv<T extends EnvConfigLike>(base: T, ids: Record<string, string>): T {
  const packages: Record<string, PackageConfigLike> = { ...base.packages }

  for (const [name, id] of Object.entries(ids)) {
    const prior = base.packages[name]
    if (!prior) {
      throw new Error(
        `localizeEnv: package '${name}' is not in the base env. ` +
          `Available: ${Object.keys(base.packages).join(', ') || '(none)'}`
      )
    }
    packages[name] = {
      originalId: id,
      publishedAt: id,
      typeOrigins: Object.fromEntries(Object.keys(prior.typeOrigins).map(k => [k, id])),
    }
  }

  return { ...base, packages }
}
