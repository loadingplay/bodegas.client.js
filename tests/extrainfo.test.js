/* global QUnit */
/* global ShoppingCart */
/* global ExtraInfo */

'use strict';

var shopping_cart;

QUnit.module('ExtraInfo', {
    setup : function()
    {
        shopping_cart = new ShoppingCart(2);
    }
});

QUnit.test('Add', function(assert)
{
    assert.ok(shopping_cart.extra_info instanceof ExtraInfo);

    // can set data
    assert.ok(shopping_cart.extra_info.set_data('foo', 'foo'), 'can add string');
    assert.ok(shopping_cart.extra_info.set_data('foo', {}), 'can add object');
    assert.ok(shopping_cart.extra_info.set_data('foo', []), 'can add list');
    assert.ok(shopping_cart.extra_info.set_data('foo', 1), 'can add integer');
    assert.ok(shopping_cart.extra_info.set_data(1, 'foo'), 'index can be number');

    // false cases
    assert.ok(!shopping_cart.extra_info.set_data({}, 'foo'), 'index cannot be object');
    assert.ok(!shopping_cart.extra_info.set_data([], 'foo'), 'index cannot be list');
});

QUnit.test('Read', function(assert)
{
    // set and read data
    assert.ok(shopping_cart.extra_info.set_data('foo', 'foo'), 'can add string');
    assert.equal(shopping_cart.extra_info.get_data('foo'), 'foo', 'can read string');

    assert.ok(shopping_cart.extra_info.set_data('foo', {}), 'can add object');
    assert.deepEqual(shopping_cart.extra_info.get_data('foo'), {}, 'can read object');

    assert.ok(shopping_cart.extra_info.set_data('foo', 1), 'can add integer');
    assert.equal(shopping_cart.extra_info.get_data('foo'), 1, 'can read integer');
});
