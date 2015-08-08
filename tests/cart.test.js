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
            product = new Product();
            shopping_cart = new ShoppingCart();
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


        shopping_cart.addProduct(product.id, product.main_price, product.name);        
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1');

        shopping_cart.addProduct(product.id, product.main_price, product.name);
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1 after adding same product twice');
        assert.equal(shopping_cart.getProducts()[0].quantity, 2, 'quantity == 2 after adding same product twice');

        shopping_cart.addProduct(product2.id, product2.main_price, product2.name);        
        assert.equal(shopping_cart.getProducts().length, 2, 'shoppint cart length == 2 after adding diferent product'); 

        shopping_cart.removeOne(product.id);
        assert.equal(shopping_cart.getProducts()[0].quantity, 1, 'quantity of first item == 1 after removing one');
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

        shopping_cart.addProduct(product.id, product.main_price, product.name);

        assert.equal(
            shopping_cart.getProducts()[0].total, 
            product.main_price, 
            'total for just one added product');

        shopping_cart.addProduct(product.id, product.main_price, product.name);

        assert.equal(
            shopping_cart.getProducts()[0].total,
            product.main_price * 2,
            'total after adding the same product again');

        assert.equal(
            shopping_cart.getTotal(),
            product.main_price * 2);

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

        shopping_cart.addProduct(product.id, product.main_price, product.name);
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