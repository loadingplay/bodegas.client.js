QUnit.module('facade', {});

QUnit.test('onload', function(assert)
{
    var done = assert.async();
    var done2 = assert.async();

    // @deprecated: old way
    $('.products').ecommerce({
        'base_url': 'http://apibodegas.ondev.today',
        'onLoad': function(products)
        {
            assert.equal(1, 1, 'onLoad is executed');
            done();
        },
        'infinite_scroll': false
    });

    // more intuitive new way
    $("<div class='test'></div>").ecommerce({
        'base_url': 'http://apibodegas.ondev.today',
        'infinite_scroll': false
    })

    .on('products.loaded', function(e, products)
    {
        assert.ok(Array.isArray(products), 'return products');
        done2();
    });
});

QUnit.test('General loading', function(assert)
{
    var $products = $('<div></div>');
    var done = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();

    var $ecommerce = $products.ecommerce()
    var onProductsLoaded = function(e, products)
    {
        assert.notEqual($products.html(), '', 'products loaded');
        done();

        $ecommerce.off('products.loaded', onProductsLoaded);
    };

    $ecommerce.on('products.loaded', onProductsLoaded);

    // test with method product-list (more semanthic)
    var $products2 = $('<div></div>');
    var $ecommerce2 = $products2.ecommerce('product_list');
    var onProductsLoaded2 = function()
    {
        assert.notEqual($products2.html(), '', 'products loaded');
        done2();

        $ecommerce2.off('products.loaded', onProductsLoaded2);
    };

    $ecommerce2.on('products.loaded', onProductsLoaded2);

    // test with product_detail
    var $product_detail = $('<div class="product-detail"></div>');
    var $ecommerce3 = $product_detail.ecommerce('product_detail');
    var onProductsLoaded3 = function()
    {
        assert.notEqual($product_detail.html(), '', 'products loaded');
        done3();

        $ecommerce3.off('products.loaded', onProductsLoaded3);
    };

    $ecommerce3.on('products.loaded', onProductsLoaded3);

    // test old api
    assert.notOk($(document).ecommerce() instanceof jQuery, 'not jQuery');
    assert.ok($('<div></div>').ecommerce() instanceof jQuery, 'jQuery');
});
