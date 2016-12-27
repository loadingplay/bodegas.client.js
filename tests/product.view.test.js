/*global $*/
/*global QUnit*/
/*global Product*/
/*global ProductListView*/

var product;

QUnit.module(
    'ProductView', 
    {
        beforeEach: function()
        {
            product = new Product(2);
        }
    });


QUnit.test('render', function(assert)
{
    var product_list_view = new ProductListView();
    var loaded = assert.async();

    product_list_view.product_template = '<div><img class="product-image" />{{ name }} <span class="money" >{{ main_price }}</span></div>';

    product.list(1, 10, function(products)
    {
        var $products = $('.products');
        var $product;

        assert.equal($products.html(), '', 'product list is empty');
        product_list_view.renderProducts(products);
        assert.notEqual($products.html(), '', 'product list filled');

        $product = $('.money', $products);

        // product price is formatted as money
        assert.equal($product.html(), '$13.860');

        loaded();
    });
});
