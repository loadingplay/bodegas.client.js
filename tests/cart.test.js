/*global QUnit*/
/*global Product*/
/*global ShoppingCart*/
/*global $*/

var product;
var shopping_cart;


QUnit.module(
'Shopping cart',
{
    beforeEach: function()
    {
        product = new Product(2);
        shopping_cart = new Cart(2);
    },
    afterEach : function()
    {
        $('.cart').html('');
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

        // add a product
        shopping_cart.addProduct(
            product.id, '', '', product.main_price,
            product.name, product.upp
        );

        // check the product was added correctly
        assert.equal(
            shopping_cart.getProducts().length, 1,
            'shoppint cart length == 1');

        // TODO: fix those tests
        assert.deepEqual(
            shopping_cart.getProducts()[0].images,[{'url': '', 'thumb_1': '', 'thumb_200': '', 'thumb_500': ''}],
            'images should be blank...');

        // add another
        shopping_cart.addProduct(
            product.id, '', '', product.main_price,
            product.name, product.upp);
        assert.equal(
            shopping_cart.getProducts().length, 1,
            'shoppint cart length == 1 after adding same product twice'
        );
        assert.equal(
            shopping_cart.getProducts()[0].quantity, 2,
            'quantity == 2 after adding same product twice'
        );
        assert.equal(
            shopping_cart.getProducts()[0].upp_total, 4,
            'upp x quantity == 4.');

        // add a new product
        shopping_cart.addProduct(
            product2.id, '', '', product2.main_price,
            product2.name, product.upp);
        assert.equal(
            shopping_cart.getProducts().length, 2,
            'shoppint cart length == 2 after adding diferent product');

        shopping_cart.removeOne(product.id);
        assert.equal(
            shopping_cart.getProducts()[0].quantity, 1,
            'quantity of first item == 1 after removing one'
        );
        assert.equal(
            shopping_cart.getProducts()[0].upp_total, 2,
            'upp x quantity == 2');

        // remove a product
        shopping_cart.removeOne(product.id);
        assert.equal(
            shopping_cart.getProducts().length, 1,
            'shoppint cart length == 1 after removing \
            another one & quantity reached 0'
        );

        products_loaded();
    });
});


QUnit.test('totals', function(assert)
{
    var products_loaded = assert.async();

    shopping_cart = new Cart(2);

    product.list(1,10, function(products)
    {
        var product = products[0];

        shopping_cart.addProduct(
            product.id, product.sku, '', product.main_price, product.name, product.upp);

        assert.equal(
            shopping_cart.getProducts()[0].total,
            product.main_price,
            'total for just one added product');

        assert.equal(
            shopping_cart.getProducts()[0].upp_total,
            product.upp,
            'upp total for just one added product');

        shopping_cart.addProduct(
            product.id, product.sku, '', product.main_price, product.name, product.upp);

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
    var shopping_cart_loaded = assert.async();

    $('.cart').html('');

    product.list(1,10, function(products)
    {
        var new_shopping_cart;
        var product = products[0];

        shopping_cart.addProduct(
            product.id,
            product.sku,
            '',
            product.main_price,
            product.name,
            product.upp
        );
        assert.equal(shopping_cart.getProducts().length, 1, 'length is one');

        assert.equal(
            $.cookie('shopping-cart'),
            shopping_cart.getGUID(),
            'guid created'
        );

        // create a brand new instance
        new_shopping_cart = new Cart();

        // check if guid is conserved
        assert.equal(
            shopping_cart.getGUID(), new_shopping_cart.getGUID(),
            'guid is conserved'
        );

        new_shopping_cart.loadCart(
            function()
            {
                assert.deepEqual(
                    new_shopping_cart.getProducts(),
                    shopping_cart.getProducts(),
                    'old products are loaded'
                );
                shopping_cart_loaded();
            });

    });
});


QUnit.test('load from cache an expired cart', function(assert)
{
    var shopping_cart_loaded = assert.async();
    var old_cookie = $.cookie('shopping-cart');

    $('.cart').html('');

    shopping_cart.loadCart(function()
    {
        shopping_cart.guid = 'foo';
        shopping_cart.loadCart(function(products)
        {
            assert.notEqual(shopping_cart.guid, 'foo', 'guids are not equals' );
            assert.deepEqual(shopping_cart.getProducts(), [], 'model empty');
            assert.notEqual(old_cookie, $.cookie('shopping-cart'));

            shopping_cart_loaded();
        });
    });

});


QUnit.test('callback on save cart', function(assert)
{
    var callback_executed = assert.async();

    shopping_cart.saveModel(function(e)
    {
        assert.ok(true, 'callback is executed');
        callback_executed();
        shopping_cart.saveModel($.noop);
    });
});

QUnit.test('test add to cart with variants selected', function(assert)
{
    // init ecommerce
    var done = assert.async();
    var loaded = false;
    var $container = $('<div></div>');
    $container.appendTo($('.cart'));

    // add product template
    $('<div id="product_detail" >\
        <div> \
            {{ name }} \
            <div class="variants" ></div>\
            <button \
                product-id="{{ id }}" product-name="{{ name }}" \
                product-sku="{{ sku }}" product-price="{{ main_price }}" \
                product-combination="1-rojo" \
                lp-cart-add >\
                    add to cart\
            </button>\
        </div>\
    <div>').appendTo($('.cart'));

    var ecommerce = $container.ecommerce('product_detail', {
        'app_public' : 100,
        'base_url' : 'http://apibodegas.ondev.today/',
        'product_id' : 1212  // this product has variants is mockjax
    }).on(
        "products.loaded",
        function()
        {
            // define some functions
            var variantsLoaded = function(e, variants)
            {
                // select a variant within the shopping cart
                $('.variant-value[variant=talla]')[0].click();
                $('.variant-value[variant=color]')[0].click();

                var facade = ecommerce.data('ecommerce');

                // from view point of view combination is just
                // another field from button
                $('[lp-cart-add]').attr(
                    'product-combination',
                    facade.variants_view.getSelectedCombination());

                // add a product to shopping cart
                $('[lp-cart-add]')[0].click();

                // check if product was added within variant
                assert.equal(
                    facade.ecommerce.cart.getProducts()[0].sku, '2212121'
                );
                assert.equal(
                    facade.ecommerce.cart.getProducts()[0].combination,
                    '1-rojo'
                );

                // select another combination
                $('.variant-value[variant=talla]')[1].click();
                $('.variant-value[variant=color]')[1].click();

                $('[lp-cart-add]').attr(
                    'product-combination',
                    facade.variants_view.getSelectedCombination()
                );

                // hit add to cart
                $('[lp-cart-add]')[0].click();

                // now should be 2 products in shopping cart
                // since are differents sku
                assert.equal(facade.ecommerce.cart.getProducts().length, 2);

                // check both product doesnt add the same
                assert.equal(
                    facade.ecommerce.cart.getProducts()[0].quantity, 1
                );
                assert.equal(
                    facade.ecommerce.cart.getProducts()[1].quantity, 1
                );

                assert.equal(
                    facade.ecommerce.cart.getProducts()[1].combination,
                    '2-verde'
                );

                // this is a buggy situation:
                // check if combination are generated in right order
                // even when selected in disorder
                facade.variants_view.selected_values = [];
                $('.variant-value').removeClass('active');
                $('.variant-value[variant=color]')[1].click();
                $('.variant-value[variant=talla]')[0].click();
                // add to cart
                $('[lp-cart-add]').attr(
                    'product-combination',
                    facade.variants_view.getSelectedCombination()
                );
                $('[lp-cart-add]')[0].click();  // add to cart
                assert.equal(
                    facade.ecommerce.cart.getProducts()[0].combination,
                    '1-rojo',
                    'combination must be in right order'
                );

                // test with addone and remove one
                // TODO: create those tests
                // facade.ecommerce.cart.view.addOneClick(
                //     $('<div product-id="1212" ></div>')
                // );
                //
                // assert.equal(facade.ecommerce.cart.getProducts()[0].quantity, 2);
                // assert.equal(facade.ecommerce.cart.getProducts()[1].quantity, 1);

                done();
            };

            // execute variants loading just once
            if (loaded) return false;
            loaded = true;

            // init variants
            $container.ecommerce(
                'load_variants',
                { "variants": { "container": $(".variants") } }
            ).on("variants.loaded", variantsLoaded);
        }
    );
});
