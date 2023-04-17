module fixture::fixture {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct WithGenericField<T: store> has key {
        id: UID,
        generic_field: T,
    }

    public fun create_with_generic_field<T: store>(generic_field: T, tx_context: &mut TxContext) {
        let obj = WithGenericField {
            id: object::new(tx_context),
            generic_field,
        };
        transfer::transfer(obj, tx_context::sender(tx_context));
    }
}