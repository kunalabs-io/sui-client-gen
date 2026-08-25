// Pre-upgrade copy of `move/examples/sources/other_module.move`.
//
// Global setup publishes the examples package with this file in place, then restores the real
// one and upgrades. That makes `other_module::AddedInAnUpgrade` originate one version later
// than every other type in the package, reproducing on a throwaway localnet the split type
// origins the package has on testnet — where it was genuinely added in an upgrade.
//
// Keep this in sync with the real module except for `AddedInAnUpgrade`; setup asserts that the
// struct is absent here and present there, so drift fails loudly rather than silently
// collapsing the two versions into one.
module examples::other_module;

public struct StructFromOtherModule has store {}

public fun new(): StructFromOtherModule {
    StructFromOtherModule {}
}
