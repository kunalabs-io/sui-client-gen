module dep::lib;

public struct DepStruct has copy, drop, store {
    value: u64,
}

public fun new_dep(value: u64): DepStruct {
    DepStruct { value }
}
