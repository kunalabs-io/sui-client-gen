module pkg_unpublished_toplevel::main;

use pkg_unpublished_transitive::lib::TransitiveStruct;

#[allow(unused_field)]
/// Struct for unpublished top-level package
public struct UnpubStruct has key {
    id: UID,
    inner: TransitiveStruct,
}
