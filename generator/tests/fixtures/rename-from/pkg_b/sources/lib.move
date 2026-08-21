module pkg_b::lib;

/// Struct from the "real" pkg_b
public struct BStruct has copy, drop, store {
    value: u64,
}

public fun new_b(value: u64): BStruct {
    BStruct { value }
}
