/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/

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

        products_loaded();
    });
});
