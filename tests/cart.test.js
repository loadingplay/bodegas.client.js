/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/
/*global $*/

'use strict';
var product;
var shopping_cart;


QUnit.module(
    'Shopping cart', 
    {
        setup: function()
        {
            product = new Product(2);
            shopping_cart = new ShoppingCart(2);
        },
        teardown : function()
        {
            $.removeCookie('shopping-cart');
        }
    });


QUnit.test('cart', function(assert)
{
    var products_loaded = assert.async();

    product.list(1, 10, function(products)
    {

        var product = products[0];
        var product2= products[1];


        shopping_cart.addProduct(product.id, product.main_price, product.name, product.upp);
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1');

        shopping_cart.addProduct(product.id, product.main_price, product.name, product.upp);
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1 after adding same product twice');
        assert.equal(shopping_cart.getProducts()[0].quantity, 2, 'quantity == 2 after adding same product twice');
        assert.equal(shopping_cart.getProducts()[0].upp_total, 4, 'upp x quantity == 4');

        shopping_cart.addProduct(product2.id, product2.main_price, product2.name, product.upp);        
        assert.equal(shopping_cart.getProducts().length, 2, 'shoppint cart length == 2 after adding diferent product'); 

        shopping_cart.removeOne(product.id);
        assert.equal(shopping_cart.getProducts()[0].quantity, 1, 'quantity of first item == 1 after removing one');
        assert.equal(shopping_cart.getProducts()[0].upp_total, 2, 'upp x quantity == 2');
        shopping_cart.removeOne(product.id);
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1 after removing another one & quantity reached 0');

        products_loaded();
    });
});


QUnit.test('totals', function(assert)
{
    var products_loaded = assert.async();

    product.list(1,10, function(products)
    {
        var product = products[0];

        shopping_cart.addProduct(product.id, product.main_price, product.name, product.upp);

        assert.equal(
            shopping_cart.getProducts()[0].total, 
            product.main_price, 
            'total for just one added product');

        assert.equal(
            shopping_cart.getProducts()[0].upp_total,
            product.upp,
            'upp total for just one added product');

        shopping_cart.addProduct(product.id, product.main_price, product.name, product.upp);

        assert.equal(
            shopping_cart.getProducts()[0].total,
            product.main_price * 2,
            'total after adding the same product again');

        assert.equal(
            shopping_cart.getProducts()[0].upp_total,
            product.upp * 2,
            'upp total after adding the same product again');

        assert.equal(
            shopping_cart.getTotal(),
            product.main_price * 2);

        assert.equal(
            shopping_cart.getUPPTotal(),
            product.upp * 2);

        products_loaded();
    });
});

QUnit.test('load from cache', function(assert)
{
    var products_loaded = assert.async();
    var shopping_cart_loaded = assert.async();

    $('.cart').html('');

    product.list(1,10, function(products)
    {
        var new_shopping_cart;
        var product = products[0];

        shopping_cart.addProduct(product.id, product.main_price, product.name, product.upp);
        assert.equal(shopping_cart.getProducts().length, 1, 'length is one');

        assert.equal($.cookie('shopping-cart'), shopping_cart.getGUID(), 'guid created');

        // create a brand new instance
        new_shopping_cart = new ShoppingCart();

        // check if guid is conserved
        assert.equal(shopping_cart.getGUID(), new_shopping_cart.getGUID(), 'guid is conserved');

        new_shopping_cart.loadCart(function()
        {
            assert.deepEqual(new_shopping_cart.getProducts(), shopping_cart.getProducts(), 'old products are loaded');
            shopping_cart_loaded();
        });

        products_loaded();
    });
});


QUnit.test('load from cache an expired cart', function(assert)
{
    var shopping_cart_loaded = assert.async();
    var old_cookie = $.cookie('shopping-cart');

    $('.cart').html('');

    shopping_cart.guid = 'foo';
    shopping_cart.loadCart(function(products)
    {
        assert.notEqual(shopping_cart.guid, 'foo', 'guids are not equals' );
        assert.deepEqual(shopping_cart.model, [], 'model empty');
        assert.notEqual(old_cookie, $.cookie('shopping-cart'));

        shopping_cart_loaded();
    });

});


QUnit.test('callback on save cart', function(assert)
{
    var callback_executed = assert.async();

    shopping_cart.saveModel(function(e)
    {
        assert.notEqual(e, undefined, 'callback is executed');
        callback_executed();
    })
})
