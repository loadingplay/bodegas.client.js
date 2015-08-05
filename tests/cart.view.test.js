/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/
/*global ShoppingCartView*/
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
    var shopping_cart_view;

    $('.cart').load('html/buy_button.html', function()
    {
        var $button = $('.add-to-cart');
        var product_id = $button.attr('product-id');

        shopping_cart_view = new ShoppingCartView();

        $button.click();

        assert.equal(shopping_cart_view.controller.getProducts().length, 2, 'added product on click on add to cart');
        assert.equal(shopping_cart_view.controller.getProducts()[0].id, product_id, 'added right product');
        assert.equal(shopping_cart_view.controller.getProducts()[1].id, 9, 'added a different product right');

        assert.notEqual($.trim($('.shopping-cart').html()), '', 'shopping cart is not empty');
        assert.equal($('.product').length, 2, 'added two products');

        html_loaded();
    });
});


QUnit.test('add button', function(assert)
{
    var html_loaded = assert.async();
    var shopping_cart_view,
        $button,
        $add_button,
        $remove_button;

    $('.cart').load('html/buy_button.html', function()
    {
        // add button
        shopping_cart_view = new ShoppingCartView();

        $button = $('.add-to-cart');
        $button.click();

        $add_button = $('.add-one');
        $add_button.click();

        assert.equal(shopping_cart_view.controller.getProducts()[0].quantity, 2, 'added one product after + click');
        assert.equal($.trim($('.quantity').html()), '2');

        // remove button
        $remove_button = $('.remove-one');
        $remove_button.click();

        assert.equal(shopping_cart_view.controller.getProducts()[0].quantity, 1, 'removed product after click - button');
        assert.equal(
            shopping_cart_view.controller.getProducts()[0].total, 
            shopping_cart_view.controller.getProducts()[0].price, 'price is updated');

        html_loaded();
    });
});
