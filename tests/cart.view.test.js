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
            $('.cart').html('');
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

        shopping_cart_view = (new ShoppingCart()).view;  // dont init double instance

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
        $remove_button,
        $delete_button;

    $('.cart').load('html/buy_button.html', function()
    {
        // add button
        shopping_cart_view = (new ShoppingCart()).view;  // dont init double instance
        shopping_cart_view.controller.model = [];

        $button = $('.add-to-cart');
        $button.click();

        $add_button = $('.add-one');
        $add_button.click();

        assert.equal(shopping_cart_view.controller.getProducts()[0].quantity, 2, 'added one product after + click');
        assert.equal($.trim($('.quantity').html()), '2', 'quantity is correct in html');

        // remove button
        $remove_button = $('.remove-one');
        $remove_button.click();

        assert.equal(shopping_cart_view.controller.getProducts()[0].quantity, 1, 'removed product after click - button');
        assert.equal(
            shopping_cart_view.controller.getProducts()[0].total, 
            shopping_cart_view.controller.getProducts()[0].price, 'price is updated');


        // remove product
        $delete_button = $('.remove-from-cart');
        $delete_button.click();

        assert.equal(shopping_cart_view.controller.getProducts().length, 1, 'removed element');

        // render total, with $and point for thousands separator
        assert.notEqual($('.total').html().indexOf('Total: <span class="money">$4.596</span>'), -1, '');

        html_loaded();
    });
});


QUnit.test('all buttons renders all', function(assert)
{
    // prepare
    $('.checkout').html(
        '<div class="shopping-cart"></div><div class="total_cart"></div><div class="units-total"></div>'
    );

    var $element = $('.shopping-cart');
    var $total_cart = $('.total_cart');
    var $units_total = $('.units-total');
    var view = new ShoppingCartView({
        'shipping_cost' : 10,
        'getProducts' : function()
        {
            return [{
                'name' : 'test'
            }];
        },
        'getTotal' : function()
        {
            return 1;
        },
        'getUnitsTotal' : function()
        {
            return 10;
        },
        'getUPPTotal' : function()
        {
            return 5;
        },
        'getCheckoutUrl' : function()
        {
            return 'test';
        },
        'getSiteId' : function()
        {
            return 13;
        },
        'getGUID' : function()
        {
            return 'foo';
        }
    });

    // render a single product
    view.renderProducts($element, '<div>{{ name }}</div>');
    assert.equal($element.html(), '<div>test</div>', 'render a single product');
    $element.html('');
    $total_cart.html('');

    // render total
    view.total_template = '<div>{{ total }}</div>';
    view.total_cart_template = '<div>{{ total }}</div>';

    view.renderTotal($element, $total_cart);
    assert.equal($element.html(), '<div>1</div>', 'render total');
    assert.equal($total_cart.html(), '<div>1</div>');

    $element.html('');
    $total_cart.html('');
    // render units_total on total
    view.total_template = '<div>{{ units_total }}</div>';
    view.total_cart_template = '<div>{{ units_total }}</div>';
    view.renderTotal($element, $total_cart);
    assert.equal($element.html(), '<div>10</div>', 'render units total');
    assert.equal($total_cart.html(), '<div>10</div>');

    $element.html('');
    $total_cart.html('');
    // render units per product
    view.total_template = '<div>{{ upp_total }}</div>';
    view.total_cart_template = '<div>{{ upp_total }}</div>';
    view.renderTotal($element, $total_cart);
    assert.equal($element.html(), '<div>5</div>', 'render units per product total');
    assert.equal($total_cart.html(), '<div>5</div>');


    $element.html('');
    $total_cart.html('');
    // renderUnitsTotal
    view.units_total_template = '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>';
    view.total_items_template = '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>';
    view.renderUnitsTotal($element, $total_cart); // only uses the second one
    assert.equal($units_total.html(), '<div>110105</div>', 'test renderUnitsTotal');
    assert.equal($total_cart.html(), '<div>110105</div>', 'test renderUnitsTotal');

    $element.html('');
    $total_cart.html('');
    // render units per product
    view.total_template = '<div>{{ site_id }}</div>';
    view.total_cart_template = '<div>{{ cart_id }}</div>';
    view.renderTotal($element, $total_cart);
    assert.equal($element.html(), '<div>13</div>', 'render units per product total');
    assert.equal($total_cart.html(), '<div>foo</div>');

    $('.checkout').html('');
});
