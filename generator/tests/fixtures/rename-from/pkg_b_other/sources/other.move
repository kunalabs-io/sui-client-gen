module pkg_b::other;

/// Struct from the other package that is also named pkg_b
public struct OtherStruct has copy, drop, store {
    flag: bool,
}

public fun new_other(flag: bool): OtherStruct {
    OtherStruct { flag }
}
