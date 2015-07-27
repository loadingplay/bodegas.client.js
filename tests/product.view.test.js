/*global QUnit*/
/*global Product*/
/*global ProductListView*/

'use strict';
var product = new Product();

QUnit.module(
    'ProductView', 
    {
        setup: function()
        {
            product = new Product();
        }
    });


QUnit.test('render', function(assert)
{
    var product_list_view = new ProductListView();
    var loaded = assert.async();

    product_list_view.product_template = '<div><img class="product-image" />{{ name }}</div>';

    product.list(1, 10, function(products)
    {
        var $products = $('.products');

        assert.equal($products.html(), '', 'product list is empty');
        product_list_view.renderProducts(products);
        assert.notEqual($products.html(), '', 'product list filled');
        loaded();
    });
});