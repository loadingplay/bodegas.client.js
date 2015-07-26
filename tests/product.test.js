/*global QUnit*/
/*global Product*/

'use strict';
var product = new Product();

QUnit.module(
    'Product', 
    {
        setup: function()
        {
            product = new Product();
        }
    });


QUnit.test('list', function(assert)
{
    var products_loaded = assert.async();
    var loaded_with_tags = assert.async();

    // simple test
    product.list(1, 10, function(products)
    {
        assert.equal(typeof products, 'object', 'product list is json');
        products_loaded();
    });

    // tests filtering by tags
    product.list(1, 10, 'dogs', function(products)
    {
        assert.equal(typeof products, 'object', 'product list is json');
        loaded_with_tags();
    });
});

QUnit.test('get (product detail)', function(assert)
{
    var product_loaded = assert.async();

    product.list(1, 10, function(products)
    {
        var p = products[0];

        product.get(p.id, function(product_data)
        {
            assert.equal(typeof product_data, 'object', 'product_data is object');
            assert.equal(p.description, product_data.description, 'descripcions are equal');
            product_loaded();
        });
    });
});