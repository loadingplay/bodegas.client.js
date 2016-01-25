/*global $*/
/*global QUnit*/
/*global ProductBox*/

'use strict';


QUnit.module(
    'ProductBox', 
    {
        setup: function()
        {
            // $('.product-box').html('');
        }
    });

QUnit.test('init', function(assert)
{

    // test default values
    var product_box = new ProductBox();

    assert.ok(10 === product_box.max_products, 'max_products default');
    assert.ok('' === product_box.template_origin, 'template_origin default');
    assert.ok(1 === product_box.app_public, 'app_public default');
    assert.ok('http://apibodegas.ondev.today/' === product_box.base_url, 'base_url default');
    assert.ok('' === product_box.tag, 'tag default');
    assert.ok(undefined !== product_box.$container, '$container default');


    // test values changed
    var product_box = new ProductBox('foo', {
        'maxProducts' : 'foo',
        'templateOrigin' : 'foo',
        'app_public' : 'foo',
        'base_url' : 'foo',
        'tag' : 'foo'
    });

    assert.equal('foo', product_box.max_products, 'max_products default');
    assert.equal('foo', product_box.template_origin, 'template_origin default');
    assert.equal('foo', product_box.app_public, 'app_public default');
    assert.equal('foo', product_box.base_url, 'base_url default');
    assert.equal('foo', product_box.$container, '$container default');
    assert.equal('foo', product_box.tag, 'tag default');
});

QUnit.test('load products', function(assert)
{
    var product_loaded = assert.async();

    var product_box = new ProductBox($('div'), {
        'maxProducts' : 5,
        'templateOrigin' : '.product-template',
        'app_public' : 1,
        'base_url' : 'http://apibodegas.ondev.today/',
        'tag' : ''
    });

    assert.equal(product_box.getURL(), 'http://apibodegas.ondev.today/product/list/1/1/5/false/false', 'generated url');

    product_box.loadProducts(function(products)
    {

        assert.equal(products.length, 10, 'downloaded 10 products');

        product_loaded();
    });
});


QUnit.test('render', function(assert)
{
    var loaded = assert.async();

    $('.product-box').load('html/product_template.html', function()
    {
        var $div = $('<div></div>');

        $div.css('display', 'none');
        var product_box = new ProductBox($div, {
            'maxProducts' : 5,
            'templateOrigin' : '.product-template',
            'app_public' : 1,
            'base_url' : 'http://apibodegas.ondev.today/',
            'tag' : ''
        });

        product_box.view.render(function(){
            assert.notEqual($div.html(), '', 'html is not empty');
            assert.notEqual($div.html().indexOf('CAT CHOW Adultos  8 Kg'), -1, 'contains the fist product');
            assert.notEqual($div.html().indexOf('DOG CHOW Ad Pollo 21 Kg'), -1, 'contains the last product');

            loaded();
        });

    });
});

QUnit.test('facade', function(assert)
{
    var loaded = assert.async();

    $('.product-box').load('html/product_template.html', function()
    {
        var $div = $('<div></div>');
        $div.ecommerce('product_box', {
            'maxProducts' : 5,
            'templateOrigin' : '.product-template',
            'app_public' : 1,
            'base_url' : 'http://apibodegas.ondev.today/',
            'tag' : ''
        });

        setTimeout(function() 
        {
            assert.notEqual($div.html(), '', 'html is not empty');
            assert.notEqual($div.html().indexOf('CAT CHOW Adultos  8 Kg'), -1, 'contains the fist product');
            assert.notEqual($div.html().indexOf('DOG CHOW Ad Pollo 21 Kg'), -1, 'contains the last product');

            loaded();
        }, 1000);

    });

});

QUnit.test('onReady', function(assert)
{
    var loaded = assert.async();

    $('.product-box').load('html/product_template.html', function()
    {
        var $div = $('<div></div>');
        $div.ecommerce('product_box', {
            'maxProducts' : 5,
            'templateOrigin' : '.product-template',
            'app_public' : 1,
            'base_url' : 'http://apibodegas.ondev.today/',
            'tag' : '',
            'onLoad' : function(products)
            {
                assert.ok(products.length === 10, 'method onload');
                loaded();
            }
        });

    });

});

QUnit.test('double onReady', function(assert){
    var loaded = assert.async();
    var loaded_2 = assert.async(); 

    $('.product-box').load('html/product_template.html', function()
    {
        var $div = $('<div></div>');
        var $div2= $('<div></div>');

        var config = {
            'maxProducts' : 5,
            'templateOrigin' : '.product-template',
            'app_public' : 1,
            'base_url' : 'http://apibodegas.ondev.today/',
            'tag' : '',
            'onLoad' : function(products)
            {
                assert.ok(true, 'loaded 1');
                loaded();
            }
        };
        $div.ecommerce('product_box', config);

        config.onLoad = function(products) {
            assert.ok(true, 'loaded 2');
            loaded_2();
        };

        $div2.ecommerce('product_box', config);

    });
});
