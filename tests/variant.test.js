/* global $ */

var preset = function()
{
    // set varinats json
    // should be equal to api
    this.variants_json = [{
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
};

var qunit_preconfig = {
    beforeEach: preset,
    setup: preset
};

QUnit.module('variants', qunit_preconfig);

QUnit.test('load variants', function(assert)
{
    var done = assert.async();

    // load product variants
    var $cellar = $('<div></div>');
    var $holder = $('<div></div>');

    $cellar.ecommerce('load_variants',
    {
        "variants": {
            "container": $holder
        }
    })
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
        assert.equal(tags[0].name, 'talla', 'is loading variants from API');

        done();
    });

    // load values
    variants.getValues('aa', 'talla,color', function(values)
    {
        assert.equal(typeof values, 'object', 'values loaded');
        assert.equal(values[0].values[0].value, '1', 'values loaded');

        done2();
    });
});

QUnit.test('rendering test', function(assert)
{
    var $target = $('<div></div>');
    var variants_view = new VariantsView($target);

    variants_view.render(this.variants_json);

    assert.notEqual(
        $target.html().indexOf('<div class="variant-head">talla</div>'),
        -1, 'variant drawed'
    );

    assert.notEqual(
        $target.html().indexOf('<div class="variant-head">color</div>'),
        -1, 'variant drawed'
    );

    // test if value was rendered
    var html = $target.html().replace(/\s/g, "");
    var expected = '<div class="variant" >\
        <div class="variant-head" >talla</div>\
        <div class="variant-values">\
            <div class="variant-value" variant="talla" value="1" >1</div>\
            <div class="variant-value" variant="talla" value="2" >2</div>\
            <div class="variant-value" variant="talla" value="3" >3</div>\
        </div>\
    </div>'.replace(/\s/g, "");

    assert.notEqual(html.indexOf(expected), -1, 'is rendering values');

});


/**
 * test if the user can select a combination from variants
 * i.e if the user is clicking on size and color, should get something like
 * [SKU]-[SIZE]-[COLOR]
 */
QUnit.test('test select variant render', function(assert)
{
    // do some basic render for variants
    var $target = $('<div></div>');
    var variants_view = new VariantsView($target);
    var done = assert.async();
    $target.appendTo($('.variants'));

    variants_view.render(this.variants_json);

    // check if selected combination is empty
    assert.equal(variants_view.getSelectedCombination(), "", 'combination empty');

    // simulate click over some variants, should be 1
    $('.variant-value[variant=talla]', $target)[0].click();
    assert.equal(
        variants_view.getSelectedCombination(), "1", 'combination is 1');
    // check if the corresponding div is active
    assert.ok(
        $($('.variant-value[variant=talla]', $target)[0]).hasClass('value-active'),
        'add the active class'
    );

    // now simulate click on second one, should be 2,
    // both are from "talla" and should be overwritten
    $('.variant-value[variant=talla]', $target)[1].click();
    assert.equal(
        variants_view.getSelectedCombination(), "2", 'combination is 2');
    // check if the corresponding div is active
    assert.notOk(
        $($('.variant-value[variant=talla]', $target)[0]).hasClass('value-active'),
        'remove the active class'
    );
    assert.ok(
        $($('.variant-value[variant=talla]', $target)[1]).hasClass('value-active'),
        'added the active class'
    );

    // now click on other variant value, should be concatenated
    $('.variant-value[variant=color]', $target)[0].click();
    assert.equal(
        variants_view.getSelectedCombination(), "2-rojo", 'combination is 2-rojo');

    // check if the event is working
    variants_view.$target.on('combination:selected', function(e, combination)
    {
        assert.equal(combination, '2-verde', 'event is working');
        done();
    });
    $('.variant-value[variant=color]', $target)[1].click();

});
