module pkg_published_toplevel::main;

use pkg_published_transitive::lib::SharedStruct;

/// The original struct defined in v1
public struct OriginalStruct has key {
    id: UID,
    data: SharedStruct,
}

/// New struct added in v2 - will have different type origin
public struct AddedInV2 has key {
    id: UID,
    count: u64,
}

public fun create_original(ctx: &mut sui::tx_context::TxContext, value: u64): OriginalStruct {
    OriginalStruct {
        id: sui::object::new(ctx),
        data: pkg_published_transitive::lib::new_shared(value),
    }
}

public fun create_added_in_v2(ctx: &mut sui::tx_context::TxContext, count: u64): AddedInV2 {
    AddedInV2 {
        id: sui::object::new(ctx),
        count,
    }
}
