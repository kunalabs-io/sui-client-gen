module pkg_published_transitive_alt::lib;

/// A simple struct that will be used as a transitive dependency
public struct SharedStruct has copy, drop, store {
    value: u64,
}

public fun new_shared(value: u64): SharedStruct {
    SharedStruct { value }
}

public fun get_value(s: &SharedStruct): u64 {
    s.value
}
