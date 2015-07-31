/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/
/*global $*/

'use strict';
var product;
var shopping_cart;

QUnit.module(
    'Shopping cart View', 
    {
        setup: function()
        {
            product = new Product();
            shopping_cart = new ShoppingCart();
        }
    });


QUnit.test('cart', function(assert)
{
    var html_loaded = assert.async();
    var shopping_cart_view = new ShoppingCartView();

    $('.cart').load('html/buy_button.html', function()
    {
        var $button = $('.add-to-cart');
        var product_id = $button.attr('product-id');

        $button.click();

        assert.equal(shopping_cart_view.controller.getProducts().length, 2, 'added product on click on add to cart');
        assert.equal(shopping_cart_view.controller.getProducts()[0].id, product_id, 'added right product');
        assert.equal(shopping_cart_view.controller.getProducts()[1].id, 9, 'added a different product right');
        html_loaded();
    });

    // var products_loaded = assert.async();

    // product.list(1, 10, function(products)
    // {
    //     var product = products[0];
    //     var product2= products[1];

    //     // add product
    //     shopping_cart.addProduct(product.id, product.main_price, product.name);
    //     assert.equal(shopping_cart.getProducts().length, 1, 'shoppint cart length == 1');

    //     // remove product
    //     shopping_cart.removeProduct(product.id);
    //     assert.equal(shopping_cart.getProducts().length, 0, 'shoppint cart length == 0 after removing');


    //     shopping_cart.addProduct(product.id, product.main_price, product.name);
    //     shopping_cart.addProduct(product2.id, product2.main_price, product2.name);
    //     assert.equal(shopping_cart.getProducts().length, 2, 'length == 2 after adding two diferent products');

    //     shopping_cart.addProduct(product.id, product.main_price, product.name);
    //     assert.equal(shopping_cart.getProducts().length, 2, 'length == 2 after adding an existing product');

    //     assert.equal(shopping_cart.getProducts()[0].quantity, 2, 'quantity is 2 after adding an existing product');

    //     products_loaded();
    // });
});
