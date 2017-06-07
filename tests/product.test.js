/*global QUnit*/
/*global Product*/
/*global $*/

var product;

QUnit.module(
    'Product', 
    {
        beforeEach: function()
        {
            product = new Product(2);
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
            assert.equal(p.upp, product_data.upp, 'product upp are equals');
            assert.equal(p.upp, 2);
            product_loaded();
        });
    });
});


QUnit.test('product detail on load', function(assert)
{
    var product_loaded = assert.async();

    $(document).ecommerce(
        'product_detail',
        {
            'app_public' : 100,
            'base_url' : 'http://apibodegas.ondev.today/',
            'product_id' : 1127,
            'onLoad' : function(product)
            {
                assert.ok(true);
                assert.ok(product.bullet_3 === 'foo');

                product_loaded();
            }
        });
});
