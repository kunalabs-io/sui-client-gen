module pkg_transitive_legacy::lib;

/// Simple struct for unpublished transitive dependency
public struct LegacyTransitiveStruct has copy, drop, store {
    flag: bool,
}

public fun new_legacy_transitive(flag: bool): LegacyTransitiveStruct {
    LegacyTransitiveStruct { flag }
}
