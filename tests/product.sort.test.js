QUnit.test('product sort', function(assert) 
{
    var $env = $('<div></div>');
    var done = assert.async();

    $($env).ecommerce({
        onLoad: function(products)
        {
            assert.equal(0, 0, 'nada');

            $($env).ecommerce('sort-by-price', 'desc', function(products)
            {
                var aux = products[0].main_price;
                for (var i = 1; i < products.length; i++) 
                {
                    assert.ok((aux > products[i].main_price), 'all products are sorted');

                    aux = products[i].main_price;
                }

                done();
            });
        }
    });

});
