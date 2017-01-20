QUnit.module('facade', {});

QUnit.test('onload', function(assert) 
{
    var done = assert.async();
    $("body").append("<div class='test'></div>");
    $(".test").ecommerce({
        'base_url': 'http://apibodegas.ondev.today',
        'onLoad': function()
        {
            assert.equal(1, 1, 'onLoad is executed');
            done();
        }
    });
});
