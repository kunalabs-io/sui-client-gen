module examples::other_module {
    struct StructFromOtherModule has store { }

    struct AddedInAnUpgrade has copy, drop, store { }

    public fun new(): StructFromOtherModule {
        StructFromOtherModule {}
    }
}