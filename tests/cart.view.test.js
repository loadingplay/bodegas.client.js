/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/
/*global ShoppingCartView*/
/*global $*/

var product;
var shopping_cart;

QUnit.module(
    'Shopping cart View',
    {
        beforeEach: function()
        {
            $('.cart').html('');
            $(document).off('[lp-cart-add-one]');
            $(document).off('[lp-cart-remove-one]');
            $(document).off('[lp-cart-remove]');
        }
    });


QUnit.test('cart', function(assert)
{
    var html_loaded = assert.async();

    $('.cart').load('html/buy_button.html', function()
    {
        var $button = $('[lp-cart-add]');
        var product_sku = $button.attr('product-sku');

        var shopping_cart = new Cart();
        var shopping_cart_view = shopping_cart.view;  // dont init double instance

        // new interface
        $button.attr('lp-cart-add', product_sku);
        $button.click();

        assert.equal(shopping_cart.getProducts().length, 2, 'added product on click on add to cart');
        assert.equal(shopping_cart.getProducts()[0].sku, product_sku, 'added right product');
        assert.equal(shopping_cart.getProducts()[1].sku, 9, 'added a different product right');

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
        var shopping_cart = new Cart();
        shopping_cart_view = shopping_cart.view;  // dont init double instance

        $button = $('[lp-cart-add]');
        $button.click();

        $add_button = $('[lp-cart-add-one]');
        $add_button.click();

        assert.equal(shopping_cart.getProducts()[0].quantity, 2, 'added one product after + click');
        assert.equal($.trim($('.quantity').html()), '2', 'quantity is correct in html');

        // remove button
        $remove_button = $('[lp-cart-remove-one]');
        $remove_button.click();

        assert.equal(
            shopping_cart.getProducts()[0].quantity, 1,
            'removed product after click - button');
        assert.equal(
            shopping_cart.getProducts()[0].total,
            shopping_cart.getProducts()[0].price, 'price is updated');


        // remove product
        $delete_button = $('[lp-cart-remove]');
        $delete_button.click();

        assert.equal(shopping_cart.getProducts().length, 1, 'removed element');

        // render total, with $ and point for thousands separator
        assert.notEqual(
            $('.total').html()
            .indexOf('Total: <span>$4.596</span>'), -1, '');

        html_loaded();
    });
});


QUnit.test('all buttons renders all', function(assert)
{
    // prepare
    $('.checkout').html(
        '<div class="shopping-cart">\
        </div>\
        <div class="total_cart"></div>\
        <div class="units-total"></div>'
    );

    var $element = $('.shopping-cart');
    var $total_cart = $('.total_cart');
    var $units_total = $('.units-total');

    var product_view = new CartProductListView();
    var total_view = new CartTotalView();
    var extern_total_view = new ExternalCartTotalView();
    var extern_total_view2 = new ExternalCartTotalView();

    product_view.setTemplate('<div>{{ name }}</div>');
    total_view.setTemplate('<div>{{ total }}</div>');
    extern_total_view.setTemplate('<div>{{ total }}</div>');
    extern_total_view2.setTemplate('<div>{{ units_total }}</div>');

    product_view.$target = $element;
    total_view.$target = $element;
    extern_total_view.$target = $total_cart;
    extern_total_view2.$target = $('.units-total');

    var dp = new ViewDataProvider();

    product_view.setDataProvider(dp);
    total_view.setDataProvider(dp);
    extern_total_view.setDataProvider(dp);
    extern_total_view2.setDataProvider(dp);

    dp.getData = function(v)
    {
        if (v.id === product_view.id)
        {
            return [{'name': 'test'}];
        }
        else {
            return {
                'total' : 1,
                'shipping_cost': 10,
                'units_total' : 10,
                'upp_total' : 5,
                'checkout_url' : 'test',
                'site_name' : 13,
                'cart_id' : 'foo'
            };
        }
    };

    // render a single product
    product_view.render();
    assert.equal($element.html(), '<div>test</div>', 'render a single product');
    $element.html('');
    $total_cart.html('');

    // render total
    // view.total_template = '<div>{{ total }}</div>';
    // view.total_cart_template = '<div>{{ total }}</div>';

    total_view.render();
    extern_total_view.render();

    assert.equal($element.html(), '<div>1</div>', 'render total');
    assert.equal($total_cart.html(), '<div>1</div>');

    $element.html('');
    $total_cart.html('');
    // render units_total on total
    // view.total_template = '<div>{{ units_total }}</div>';
    // view.total_cart_template = '<div>{{ units_total }}</div>';
    // view.renderTotal($element, $total_cart);
    extern_total_view.setTemplate('<div>{{ units_total }}</div>');
    total_view.setTemplate('<div>{{ units_total }}</div>');
    extern_total_view2.setTemplate('<div>{{ units_total }}</div>');

    extern_total_view.render();
    total_view.render();
    assert.equal($element.html(), '<div>10</div>', 'render units total');
    assert.equal($total_cart.html(), '<div>10</div>');

    $element.html('');
    $total_cart.html('');
    // render units per product
    // view.total_template = '<div>{{ upp_total }}</div>';
    // view.total_cart_template = '<div>{{ upp_total }}</div>';
    // view.renderTotal($element, $total_cart);
    extern_total_view.setTemplate('<div>{{ upp_total }}</div>');
    total_view.setTemplate('<div>{{ upp_total }}</div>');

    extern_total_view.render();
    total_view.render();
    assert.equal($element.html(), '<div>5</div>', 'render units per product total');
    assert.equal($total_cart.html(), '<div>5</div>');


    $element.html('');
    $total_cart.html('');
    // renderUnitsTotal
    // view.units_total_template = '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>';
    // view.total_items_template = '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>';
    // view.renderUnitsTotal($element, $total_cart); // only uses the second one

    extern_total_view.setTemplate(
        '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>');
    extern_total_view2.setTemplate(
        '<div>{{total}}{{shipping_cost}}{{units_total}}{{upp_total}}</div>');

    extern_total_view.render();
    extern_total_view2.render();
    assert.equal(
        $units_total.html(), '<div>110105</div>', 'test renderUnitsTotal');
    assert.equal(
        $total_cart.html(), '<div>110105</div>', 'test renderUnitsTotal');

    $element.html('');
    $total_cart.html('');
    // render units per product
    // view.total_template = '<div>{{ site_name }}</div>';
    // view.total_cart_template = '<div>{{ cart_id }}</div>';
    // view.renderTotal($element, $total_cart);
    total_view.setTemplate('<div>{{ site_name }}</div>');
    extern_total_view.setTemplate('<div>{{ cart_id }}</div>');

    total_view.render();
    extern_total_view.render();
    assert.equal($element.html(), '<div>13</div>', 'render units per product total');
    assert.equal($total_cart.html(), '<div>foo</div>');

    $('.checkout').html('');
});
