module root::main;

use dep::lib::DepStruct;

#[allow(unused_field)]
public struct RootStruct has key {
    id: UID,
    dep: DepStruct,
}
