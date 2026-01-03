// Copyright (c) Kuna Labs d.o.o.
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module amm::pool_tests;

use amm::pool::{Self, Pool, PoolRegistry, AdminCap, LP};
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::test_scenario::{Self, Scenario};

const ADMIN: address = @0xABBA;
const USER: address = @0xB0B;

// OTWs for currencies used in tests
public struct A has drop {}
public struct B has drop {}
public struct C has drop {}

fun scenario_init(sender: address): Scenario {
    let mut scenario = test_scenario::begin(ADMIN);
    {
        let ctx = test_scenario::ctx(&mut scenario);
        pool::init_for_testing(ctx);
    };
    test_scenario::next_tx(&mut scenario, sender);

    scenario
}

fun scenario_create_pool(
    scenario: &mut test_scenario::Scenario,
    init_a: u64,
    init_b: u64,
    lp_fee_bps: u64,
    admin_fee_pct: u64,
) {
    let mut registry = scenario.take_shared<PoolRegistry>();
    let ctx = scenario.ctx();

    let init_a = balance::create_for_testing<A>(init_a);
    let init_b = balance::create_for_testing<B>(init_b);

    let lp = pool::create(
        &mut registry,
        init_a,
        init_b,
        lp_fee_bps,
        admin_fee_pct,
        ctx,
    );
    transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

    test_scenario::return_shared(registry);
}

fun assert_and_destroy_balance<T>(balance: Balance<T>, value: u64) {
    assert!(balance.value() == value);
    balance.destroy_for_testing();
}

/* ================= create_pool tests ================= */

#[test]
#[expected_failure(abort_code = pool::EZeroInput)]
fun test_create_pool_fails_on_init_a_zero() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::zero<A>();
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(&mut registry, init_a, init_b, 0, 0, ctx);
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EZeroInput)]
fun test_create_pool_fails_on_init_b_zero() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(100);
        let init_b = balance::zero<B>();

        let lp = pool::create(&mut registry, init_a, init_b, 0, 0, ctx);
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidFeeParam)]
fun test_create_pool_fails_on_invalid_lp_fee() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(100);
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(&mut registry, init_a, init_b, 10001, 0, ctx);
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidFeeParam)]
fun test_create_pool_fails_on_invalid_admin_fee() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(100);
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(
            &mut registry,
            init_a,
            init_b,
            30,
            101,
            ctx,
        ); // aborts here
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EPoolAlreadyExists)]
fun test_create_pool_fails_on_duplicate_pair() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(200);
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(
            &mut registry,
            init_a,
            init_b,
            30,
            10,
            ctx,
        ); // aborts here
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    scenario.next_tx(ADMIN);
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(200);
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(
            &mut registry,
            init_a,
            init_b,
            30,
            10,
            ctx,
        ); // aborts here
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidPair)]
fun test_create_pool_fails_on_same_currency_pair() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(200);
        let init_b = balance::create_for_testing<A>(100);

        let lp = pool::create(
            &mut registry,
            init_a,
            init_b,
            30,
            10,
            ctx,
        ); // aborts here
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidPair)]
fun test_create_pool_fails_on_currency_pair_wrong_order() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<B>(200);
        let init_b = balance::create_for_testing<A>(100);

        let lp = pool::create(
            &mut registry,
            init_a,
            init_b,
            30,
            10,
            ctx,
        ); // aborts here
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_create_pool() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    {
        let ctx = scenario.ctx();
        pool::init_for_testing(ctx);
    };

    scenario.next_tx(ADMIN);
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(200);
        let init_b = balance::create_for_testing<B>(100);

        let lp = pool::create(&mut registry, init_a, init_b, 30, 10, ctx);
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    scenario.next_tx(ADMIN);
    {
        // test pool
        let pool = scenario.take_shared<Pool<A, B>>();

        let (a_value, b_value, lp_supply_value) = pool.values();
        assert!(a_value == 200);
        assert!(b_value == 100);
        assert!(lp_supply_value == 141);

        let (lp_fee_bps, admin_fee_pct) = pool.fees();
        assert!(lp_fee_bps == 30);
        assert!(admin_fee_pct == 10);

        test_scenario::return_shared(pool);

        // test admin cap
        let admin_cap = scenario.take_from_sender<AdminCap>();
        test_scenario::return_to_sender(scenario, admin_cap);
    };

    // create another one
    scenario.next_tx(ADMIN);
    {
        let mut registry = scenario.take_shared<PoolRegistry>();
        let ctx = scenario.ctx();

        let init_a = balance::create_for_testing<A>(200);
        let init_b = balance::create_for_testing<C>(100);

        let lp = pool::create(&mut registry, init_a, init_b, 30, 10, ctx);
        transfer::public_transfer(lp.into_coin(ctx), ctx.sender());

        test_scenario::return_shared(registry);
    };

    test_scenario::end(scenario_val);
}

/* ================= deposit tests ================= */

#[test]
fun test_deposit_on_amount_a_zero() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::zero<A>();
        let b = balance::create_for_testing<B>(10);
        let (a, b, lp) = pool.deposit(a, b, 0);

        assert!(a.value() == 0);
        assert!(b.value() == 10);
        assert!(lp.value() == 0);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_deposit_on_amount_b_zero() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(10);
        let b = balance::zero<B>();
        let (a, b, lp) = pool.deposit(a, b, 0);

        assert!(a.value() == 10);
        assert!(b.value() == 0);
        assert!(lp.value() == 0);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_deposit_on_empty_pool() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    // withdraw liquidity to make pool balances 0
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();
        let (a, b) = pool.withdraw(lp_coin.into_balance(), 0, 0);

        a.destroy_for_testing();
        b.destroy_for_testing();

        // sanity check
        let (a, b, lp) = pool.values();
        assert!(a == 0 && b == 0 && lp == 0);

        test_scenario::return_shared(pool);
    };

    // do the deposit
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(200);
        let b = balance::create_for_testing<B>(100);
        let (a, b, lp) = pool.deposit(a, b, 141);

        // check returned values
        assert!(a.value() == 0);
        assert!(b.value() == 0);
        assert!(lp.value() == 141);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        // check pool balances
        let (a, b, lp) = pool.values();
        assert!(a == 200);
        assert!(b == 100);
        assert!(lp == 141);

        // return
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_deposit() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 50, 30, 10);

    // deposit exact (100, 50, 70); -> (300, 150, 210)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(200);
        let b = balance::create_for_testing<B>(100);
        let (a, b, lp) = pool.deposit(a, b, 140);

        // check returned values
        assert!(a.value() == 0);
        assert!(b.value() == 0);
        assert!(lp.value() == 140);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        // check pool balances
        let (a, b, lp) = pool.values();
        assert!(a == 300);
        assert!(b == 150);
        assert!(lp == 210);

        // return
        test_scenario::return_shared(pool);
    };

    // deposit max B (slippage); (300, 150, 210) -> (400, 200, 280)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(110);
        let b = balance::create_for_testing<B>(50);
        let (a, b, lp) = pool.deposit(a, b, 70);

        // there's extra balance A
        assert!(a.value() == 10);
        assert!(b.value() == 0);
        assert!(lp.value() == 70);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        // check pool balances
        let (a, b, lp) = pool.values();
        assert!(a == 400);
        assert!(b == 200);
        assert!(lp == 280);

        // return
        test_scenario::return_shared(pool);
    };

    // deposit max A (slippage); (400, 200, 280) -> (500, 250, 350)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(100);
        let b = balance::create_for_testing<B>(60);
        let (a, b, lp) = pool.deposit(a, b, 70);

        // there's extra balance B
        assert!(a.value() == 0);
        assert!(b.value() == 10);
        assert!(lp.value() == 70);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        // pool balances
        let (a, b, lp) = pool.values();
        assert!(a == 500);
        assert!(b == 250);
        assert!(lp == 350);

        // return
        test_scenario::return_shared(pool);
    };

    // no lp issued when input small; (500, 250, 350) -> (501, 251, 350)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(1);
        let b = balance::create_for_testing<B>(1);
        let (a, b, lp) = pool.deposit(a, b, 0);

        // no lp issued and input balances are fully used up
        assert!(a.value() == 0);
        assert!(b.value() == 0);
        assert!(lp.value() == 0);

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        // check pool balances
        let (a, b, lp) = pool.values();
        assert!(a == 501);
        assert!(b == 251);
        assert!(lp == 350);

        // return
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EExcessiveSlippage)]
fun test_deposit_fails_on_min_lp_out() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a = balance::create_for_testing<A>(200);
        let b = balance::create_for_testing<B>(200);
        let (a, b, lp) = pool.deposit(a, b, 201); // aborts here

        a.destroy_for_testing();
        b.destroy_for_testing();
        lp.destroy_for_testing();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

/* ================= withdraw tests ================= */

#[test]
fun test_withdraw_returns_zero_on_zero_input() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let lp = balance::zero();
        let (a, b) = pool.withdraw(lp, 0, 0); // aborts here

        a.destroy_zero();
        b.destroy_zero();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_withdraw() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 13, 30, 10);

    // withdraw (100, 13, 36) -> (64, 9, 23)
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let mut lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();
        assert!(lp_coin.value() == 36); // sanity check

        let ctx = scenario.ctx();
        let lp_in = lp_coin.split(13, ctx).into_balance();
        let (a, b) = pool.withdraw(lp_in, 36, 4);

        // check output balances
        assert!(a.value() == 36);
        assert!(b.value() == 4);

        a.destroy_for_testing();
        b.destroy_for_testing();

        // check pool values
        let (a, b, lp) = pool.values();
        assert!(a == 64);
        assert!(b == 9);
        assert!(lp == 23);

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, lp_coin);
    };

    // withdraw small amount (64, 9, 23) -> (62, 9, 22)
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let mut lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();
        assert!(lp_coin.value() == 23); // sanity check

        let ctx = scenario.ctx();

        let lp_in = lp_coin.split(1, ctx).into_balance();
        let (a, b) = pool.withdraw(lp_in, 2, 0);

        // check output balances
        assert!(a.value() == 2);
        assert!(b.value() == 0);

        a.destroy_for_testing();
        b.destroy_for_testing();

        // check pool values
        let (a, b, lp) = pool.values();
        assert!(a == 62);
        assert!(b == 9);
        assert!(lp == 22);

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, lp_coin);
    };

    // withdraw all (62, 9, 22) -> (0, 0, 0)
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();

        let lp_in = lp_coin.into_balance();
        let (a, b) = pool.withdraw(lp_in, 62, 9);

        // check output balances
        assert!(a.value() == 62);
        assert!(b.value() == 9);

        a.destroy_for_testing();
        b.destroy_for_testing();

        // check pool values
        let (a, b, lp) = pool.values();
        assert!(a == 0);
        assert!(b == 0);
        assert!(lp == 0);

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EExcessiveSlippage)]
fun test_withdraw_fails_on_min_a_out() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let mut lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();
        let ctx = scenario.ctx();

        let lp_in = coin::into_balance(lp_coin.split(50, ctx));
        let (a, b) = pool.withdraw(lp_in, 51, 50); // aborts here

        a.destroy_for_testing();
        b.destroy_for_testing();

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, lp_coin);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EExcessiveSlippage)]
fun test_withdraw_fails_on_min_b_out() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let mut lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();
        let ctx = scenario.ctx();

        let lp_in = lp_coin.split(50, ctx).into_balance();
        let (a, b) = pool.withdraw(lp_in, 50, 51); // aborts here

        a.destroy_for_testing();
        b.destroy_for_testing();

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, lp_coin);
    };

    test_scenario::end(scenario_val);
}

/* ================= swap tests ================= */

#[test]
fun test_swap_a_returns_zero_on_zero_input_a() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::zero<A>();
        let b_out = pool.swap_a(a_in, 0);

        b_out.destroy_zero();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_b_returns_zero_on_zero_input_b() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::zero<B>();
        let a_out = pool.swap_b(b_in, 0);

        a_out.destroy_zero();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::ENoLiquidity)]
fun test_swap_a_fails_on_zero_pool_balances() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();

        let (a, b) = pool.withdraw(lp_coin.into_balance(), 0, 0);
        a.destroy_for_testing();
        b.destroy_for_testing();

        let a_in = balance::create_for_testing<A>(10);
        let b = pool.swap_a(a_in, 0); // aborts here

        b.destroy_for_testing();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::ENoLiquidity)]
fun test_swap_b_fails_on_zero_pool_balances() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 100, 100, 30, 10);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let lp_coin = scenario.take_from_sender<Coin<LP<A, B>>>();

        let (a, b) = pool.withdraw(lp_coin.into_balance(), 0, 0);
        a.destroy_for_testing();
        b.destroy_for_testing();

        let b_in = balance::create_for_testing<B>(10); // aborts here
        let a = pool.swap_b(b_in, 0);

        a.destroy_for_testing();

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_a_without_lp_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 200, 100, 0, 10);

    // swap; (200, 100, 141) -> (213, 94, 141)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::create_for_testing<A>(13);
        let b_out = pool.swap_a(a_in, 6);

        // check
        let (a, b, lp) = pool.values();
        assert!(a == 213);
        assert!(b == 94);
        assert!(lp == 141);
        assert!(b_out.value() == 6);
        // admin fees should also be 0 because they're calcluated
        // as percentage of lp fees
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        b_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_b_without_lp_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 200, 100, 0, 10);

    // swap; (200, 100, 141) -> (177, 113, 141)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::create_for_testing<B>(13);
        let a_out = pool.swap_b(b_in, 23);

        // check
        let (a, b, lp) = pool.values();
        assert!(a == 177);
        assert!(b == 113);
        assert!(lp == 141);
        assert!(a_out.value() == 23);
        // admin fees should also be 0 because they're calcluated
        // as percentage of lp fees
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        a_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_a_with_lp_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 0); // lp fee 30 bps

    // swap; (20000, 10000, 14142) -> (21300, 9302, 14142)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::create_for_testing<A>(1300);
        let b_out = pool.swap_a(a_in, 608);

        // check
        let (a, b, lp) = pool.values();
        assert!(a == 21300);
        assert!(b == 9392);
        assert!(lp == 14142);
        assert!(b_out.value() == 608);
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        b_out.destroy_for_testing();
    };

    // swap small amount; (21300, 9302, 14142) -> (21301, 9302, 14142)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::create_for_testing<A>(1);
        let b_out = pool.swap_a(a_in, 0);

        let (a, b, lp) = pool.values();
        assert!(a == 21301);
        assert!(b == 9392);
        assert!(lp == 14142);
        assert!(b_out.value() == 0);
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        b_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_b_with_lp_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 0); // lp fee 30 bps

    // swap; (20000, 10000, 14142) -> (17706, 11300, 14142)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::create_for_testing<B>(1300);
        let a_out = pool.swap_b(b_in, 2294);

        let (a, b, lp) = pool.values();
        assert!(a == 17706);
        assert!(b == 11300);
        assert!(lp == 14142);
        assert!(a_out.value() == 2294);
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        a_out.destroy_for_testing();
    };

    // swap small amount; (17706, 11300, 14142) -> (17706, 11301, 14142)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::create_for_testing<B>(1);
        let a_out = pool.swap_b(b_in, 0);

        let (a, b, lp) = pool.values();
        assert!(a == 17706);
        assert!(b == 11301);
        assert!(lp == 14142);
        assert!(a_out.value() == 0);
        assert!(pool.admin_fee_value() == 0);

        test_scenario::return_shared(pool);
        a_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_a_with_admin_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    // swap; (20000, 10000, 14142) -> (25000, 8005, 14143)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::create_for_testing<A>(5000);
        let b_out = pool.swap_a(a_in, 1995);

        let (a, b, lp) = pool.values();
        assert!(a == 25000);
        assert!(b == 8005);
        assert!(lp == 14143);
        assert!(b_out.value() == 1995);
        assert!(pool.admin_fee_value() == 1);

        test_scenario::return_shared(pool);
        b_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_swap_b_with_admin_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    // swap; (20000, 10000, 14142) -> (13002, 15400, 14144)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::create_for_testing<B>(5400);
        let a_out = pool.swap_b(b_in, 6998);

        let (a, b, lp) = pool.values();
        assert!(a == 13002);
        assert!(b == 15400);
        assert!(lp == 14144);
        assert!(a_out.value() == 6998);
        assert!(pool.admin_fee_value() == 2);

        test_scenario::return_shared(pool);
        a_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
public fun test_admin_fees_are_correct() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 10_000_000, 10_000_000, 30, 100);

    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let out = pool.swap_a(balance::create_for_testing(10_000), 0);
        assert_and_destroy_balance(out, 9960);

        let (a, b, lp) = pool.values();
        assert!(a == 10_010_000);
        assert!(b == 9_990_040);
        assert!(lp == 10_000_014);
        assert!(pool.admin_fee_value() == 14);

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EExcessiveSlippage)]
fun test_swap_a_fails_on_min_out() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 200, 100, 0, 10);

    // swap; (200, 100, 141) -> (213, 94, 141)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let a_in = balance::create_for_testing<A>(13);
        let b_out = pool.swap_a(a_in, 7); // aborts here

        b_out.destroy_for_testing();
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EExcessiveSlippage)]
fun test_swap_b_fails_on_min_out() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 200, 100, 0, 10);

    // swap; (200, 100, 141) -> (177, 113, 141)
    scenario.next_tx(USER);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();

        let b_in = balance::create_for_testing<B>(13);
        let a_out = pool.swap_b(b_in, 24); // aborts here

        test_scenario::return_shared(pool);
        a_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

/* ================= admin fee withdraw tests ================= */

#[test]
fun test_admin_withdraw_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    // generate fees and withdraw 1
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        // generate fees
        let b_in = balance::create_for_testing<B>(5400);
        let a_out = pool.swap_b(b_in, 6998);
        a_out.destroy_for_testing();
        assert!(pool.admin_fee_value() == 2); // sanity check

        // withdraw
        let fees_out = pool::admin_withdraw_fees(&mut pool, &cap, 1);

        assert!(pool.admin_fee_value() == 1);
        assert!(fees_out.value() == 1);

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, cap);
        fees_out.destroy_for_testing();
    };

    // withdraw all
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        // withdraw
        let fees_out = pool::admin_withdraw_fees(&mut pool, &cap, 0);

        assert!(pool.admin_fee_value() == 0);
        assert!(balance::value(&fees_out) == 1);

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, cap);
        fees_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_admin_withdraw_fees_amount_0_and_balance_0() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    // generate fees and withdraw 1
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        // withdraw
        let fees_out = pool::admin_withdraw_fees(&mut pool, &cap, 0);

        // check
        assert!(balance::value(&fees_out) == 0);

        test_scenario::return_shared(pool);
        test_scenario::return_to_sender(scenario, cap);
        fees_out.destroy_for_testing();
    };

    test_scenario::end(scenario_val);
}

#[test]
fun test_admin_set_fees() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    // sanity check
    scenario.next_tx(ADMIN);
    {
        let pool = scenario.take_shared<Pool<A, B>>();
        let (lp_fee_bps, admin_fee_pct) = pool.fees();
        assert!(lp_fee_bps == 30);
        assert!(admin_fee_pct == 30);

        test_scenario::return_shared(pool);
    };

    // change fees
    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        pool::admin_set_fees(&mut pool, &cap, 25, 10);

        test_scenario::return_to_sender(scenario, cap);
        test_scenario::return_shared(pool);
    };

    // check fees
    scenario.next_tx(ADMIN);
    {
        let pool = scenario.take_shared<Pool<A, B>>();
        let (lp_fee_bps, admin_fee_pct) = pool.fees();
        assert!(lp_fee_bps == 25);
        assert!(admin_fee_pct == 10);

        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidFeeParam)]
fun test_admin_set_fee_fails_on_invalid_lp_fee() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        pool::admin_set_fees(&mut pool, &cap, 10001, 0);

        test_scenario::return_to_sender(scenario, cap);
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}

#[test]
#[expected_failure(abort_code = pool::EInvalidFeeParam)]
fun test_admin_set_fee_fails_on_invalid_admin_fee() {
    let mut scenario_val = scenario_init(ADMIN);
    let scenario = &mut scenario_val;
    scenario_create_pool(scenario, 20000, 10000, 30, 30);

    scenario.next_tx(ADMIN);
    {
        let mut pool = scenario.take_shared<Pool<A, B>>();
        let cap = scenario.take_from_sender<AdminCap>();

        pool::admin_set_fees(&mut pool, &cap, 30, 101);

        test_scenario::return_to_sender(scenario, cap);
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario_val);
}
