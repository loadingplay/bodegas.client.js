QUnit.module('variants', {});

QUnit.test('load variants', function(assert) 
{
    var done = assert.async();

    // load product variants
    var $holder = $('<div></div>');

    $holder.ecommerce('load_variants')
    .on('variants.loaded', function(e, variants)
    {
        assert.notEqual($holder.html(), '', 'holder is not empty');
        done();
    });
});


QUnit.test('no facade tests', function(assert) 
{
    var done = assert.async();
    var done2 = assert.async();
    var variants = new Variants();

    variants.get('aa', function(tags)
    {
        assert.equal(typeof tags, 'object', 'variant list');
        assert.equal(tags[0]['name'], 'talla', 'is loading variants from API');

        done();
    });

    // load values
    variants.getValues('aa', 'talla,color', function(values)
    {
        assert.equal(typeof values, 'object', 'values loaded');
        assert.equal(values[0]["values"][0]["value"], '1', 'values loaded');

        done2();
    });
});

QUnit.test('renering test', function(assert) 
{
    var $target = $('<div></div>');
    var variants_view = new VariantsView($target);

    var values = [{
            "values": [{
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 1, 
                "value": "1", 
                "variant_name": "talla"
            }, {
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 2, 
                "value": "2", 
                "variant_name": "talla"
            }, {
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 3, 
                "value": "3", 
                "variant_name": "talla"
            }], 
            "variant_name": "talla"
        }, {
            "values": [{
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 4, 
                "value": "rojo", 
                "variant_name": "color"
            }, {
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 5, 
                "value": "verde", 
                "variant_name": "color"
            }, {
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 6, 
                "value": "azul", 
                "variant_name": "color"
            }], 
            "variant_name": "color"
        }];

    variants_view.renderValues(values);

    assert.notEqual(
        $target.html().indexOf('<div class="variant-head">talla</div>'), 
        -1, 'variant drawed'
    );

    assert.notEqual(
        $target.html().indexOf('<div class="variant-head">color</div>'), 
        -1, 'variant drawed'
    );

});
