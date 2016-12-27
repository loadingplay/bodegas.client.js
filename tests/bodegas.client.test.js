/*global QUnit*/
/*global BodegasClient*/
/*global Product*/
/*global Tag*/
/*global ShoppingCart*/


QUnit.module('Bodegas Client', {});


QUnit.test('authenticate', function(assert)
{
    var done = assert.async();
    var bodegas = new BodegasClient();

    bodegas.authenticate(100, function()
    {
        assert.ok(true, 'perform the callback');

        // insert more tests here

        done();
    });
});

QUnit.test('init', function(assert)
{
    var bodegas = new BodegasClient();

    bodegas.init(100);

    assert.equal(bodegas.site_id, 100, 'app id initialized');
    assert.ok(bodegas.product instanceof Product, 'product initialized');
    assert.ok(bodegas.tag instanceof Tag, 'tag initialized');
    assert.ok(bodegas.cart instanceof ShoppingCart, 'cart initialized');
});
