module pkg_a::main;

use pkg_b::lib::BStruct;
use pkg_b2::other::OtherStruct;

#[allow(unused_field)]
/// Uses structs from both same-named packages
public struct Combined has copy, drop, store {
    b: BStruct,
    other: OtherStruct,
}

public fun new_combined(b: BStruct, other: OtherStruct): Combined {
    Combined { b, other }
}
