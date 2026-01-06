module pkg_unpublished_transitive::lib;

/// Simple struct for unpublished transitive dependency
public struct TransitiveStruct has copy, drop, store {
    flag: bool,
}

public fun new_transitive(flag: bool): TransitiveStruct {
    TransitiveStruct { flag }
}
