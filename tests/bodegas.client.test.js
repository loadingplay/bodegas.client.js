/*global QUnit*/
/*global BodegasClient*/
/*global Product*/
/*global Tag*/
/*global Cart*/


QUnit.module('Bodegas Client', {});


QUnit.test('init', function(assert)
{
    var bodegas = new BodegasClient();

    bodegas.init("site_name");

    assert.equal(bodegas.site_name, "site_name", 'app id initialized');
    assert.ok(bodegas.product instanceof Product, 'product initialized');
    assert.ok(bodegas.tag instanceof Tag, 'tag initialized');
    assert.ok(bodegas.cart instanceof Cart, 'cart initialized');
});
