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

        // add product
        shopping_cart.addProduct(product.id, product.main_price, product.name);
        assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1');

        // remove product
        shopping_cart.removeProduct(product.id);
        assert.equal(shopping_cart.getProducts().length, 0, 'shoppint cart length == 0 after removing');


        shopping_cart.addProduct(product.id, product.main_price, product.name);
        shopping_cart.addProduct(product2.id, product2.main_price, product2.name);
        assert.equal(shopping_cart.getProducts().length, 2, 'length == 2 after adding two diferent products');

        shopping_cart.addProduct(product.id, product.main_price, product.name);
        assert.equal(shopping_cart.getProducts().length, 2, 'length == 2 after adding an existing product');

        assert.equal(shopping_cart.getProducts()[0].quantity, 2, 'quantity is 2 after adding an existing product');

        products_loaded();
    });
});
