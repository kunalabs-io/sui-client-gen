module pkg_toplevel_legacy::lib;

/// Simple struct for unpublished transitive dependency
public struct LegacyStruct has copy, drop, store {
    flag: bool,
}

public fun new_legacy(flag: bool): LegacyStruct {
    LegacyStruct { flag }
}
