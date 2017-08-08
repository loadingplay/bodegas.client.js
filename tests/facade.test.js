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

    $products.ecommerce().on('products.loaded', function(e, products)
    {
        assert.notEqual($products.html(), '', 'products loaded');
        done();
    });

    // test with method product-list (more semanthic)
    var $products2 = $('<div></div>');
    $products2.ecommerce('product_list')
    .on('products.loaded', function(e, products)
    {
        assert.notEqual($products2.html(), '', 'products loaded');
        done2();
    });


    // test with product_detail
    var $product_detail = $('<div class="product-detail"></div>');

    $product_detail.ecommerce('product_detail')
    .on('products.loaded', function(e, products)
    {
        assert.notEqual($product_detail.html(), '', 'products loaded');
        done3();
    });

    // test old api
    assert.notOk($(document).ecommerce() instanceof jQuery, 'not jQuery');
    assert.ok($('<div></div>').ecommerce() instanceof jQuery, 'jQuery');
});
