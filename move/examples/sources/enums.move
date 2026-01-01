module examples::enums;

use sui::balance::{Self, Balance};
use sui::sui::SUI;

public enum Action<T, phantom U> has store {
    Stop,
    Pause {
        duration: u32,
        generic_field: T,
        phantom_field: Balance<U>,
        reified_field: Option<u64>,
    },
    Jump(u64, T, Balance<U>, Option<u64>),
}

public fun create_stop_action<T, U>(
    duration: u32,
    generic_field: T,
    phantom_field: Balance<U>,
    reified_field: Option<u64>,
): Action<T, U> {
    Action::Pause { duration, generic_field, phantom_field, reified_field }
}

public struct Wrapped<T, U, V> has key, store {
    id: UID,
    t: T,
    u: U,
    v: V,
    stop: Action<u64, SUI>,
    pause: Action<u64, SUI>,
    jump: Action<u64, SUI>,
}

public fun create_actions(tx_context: &mut TxContext) {
    let wrapped: Wrapped<Action<u64, SUI>, Action<u64, SUI>, Action<u64, SUI>> = Wrapped {
        id: object::new(tx_context),
        t: Action::Stop,
        u: Action::Pause {
            duration: 100,
            generic_field: 101,
            phantom_field: balance::zero(),
            reified_field: option::some(102),
        },
        v: Action::Jump(103, 104, balance::zero(), option::some(105)),
        stop: Action::Stop,
        pause: Action::Pause {
            duration: 106,
            generic_field: 107,
            phantom_field: balance::zero(),
            reified_field: option::some(108),
        },
        jump: Action::Jump(109, 110, balance::zero(), option::some(111)),
    };
    transfer::public_share_object(wrapped);
}
