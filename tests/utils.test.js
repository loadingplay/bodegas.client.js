/*global QUnit*/
/*global Utils*/

'use strict';

QUnit.module('Utils', {
    setup: function()
    {
        Utils.base_url = 'http://apibodegas.ondev.today/';
    }
});

QUnit.test('getURL', function(assert)
{
    // base sample
    assert.equal(Utils.getURL('module'), 'http://apibodegas.ondev.today/module/');

    // also should works if the base url is not completed
    Utils.base_url = 'http://apibodegas.ondev.today';
    assert.equal(Utils.getURL('module'), 'http://apibodegas.ondev.today/module/');

    // args must be appended to query
    assert.equal(
        Utils.getURL('module', ['foo', 'bar']), 
        'http://apibodegas.ondev.today/module/foo/bar');
});


QUnit.test('render', function(assert)
{
    var rendered_html = Utils.render('{{ test }}', { 'test' : 'foo' });
    assert.equal(rendered_html, 'foo', 'template simple test');

    rendered_html = Utils.render('{{test}} {{ test}}', {'test' : 'foo'});
    assert.equal(rendered_html, 'foo foo', 'multiple instances with diferent formatting');

    // more complex test
    var template = '<div><img class="product-image" />{{ foo }} <span class="money" >{{ bar }}</span></div>';
    rendered_html = Utils.render(template, { 'foo' : 'foo', 'bar' : 'bar' });

    assert.equal(
        rendered_html,
        '<div><img class="product-image" />foo <span class="money" >bar</span></div>');
});


QUnit.test('render with function', function(assert)
{
    var rendered_html = Utils.render('{{ foo|friendly }}', {'foo' : 'foo bar baz'});
    assert.equal(rendered_html, 'foo_bar_baz');
});


QUnit.test('getUrlParameter', function(assert)
{
    var prefix = '?';
    if (document.location.search !== '')
    {
        prefix = '&';
    }

    // add some parameter to url
    if (document.location.search.indexOf('foo=foo') === -1)
    {
        window.history.pushState('', '', document.location.href + prefix + 'foo=foo');
    }

    assert.equal(Utils.getUrlParameter('foo'), 'foo', 'get a parameter from url');
});

QUnit.test('format money', function(assert)
{
    assert.equal(Utils.formatMoney(100), '$100');
    assert.equal(Utils.formatMoney(1000), '$1.000');
    assert.equal(Utils.formatMoney(10000), '$10.000');
    assert.equal(Utils.formatMoney(100000), '$100.000');
    assert.equal(Utils.formatMoney(1000000), '$1.000.000');
    assert.equal(Utils.formatMoney(12700000), '$12.700.000');
    assert.equal(Utils.formatMoney(127000000), '$127.000.000');
    assert.equal(Utils.formatMoney(200072), '$200.072');
});

QUnit.test('friendly url', function(assert)
{
    // replace spaces
    assert.equal(Utils.URLBeautify('foo bar baz'), 'foo_bar_baz');

    // lower case
    assert.equal(Utils.URLBeautify('FOOBARBAZ'), 'foobarbaz');

    // ñáéíóú
    assert.equal(Utils.URLBeautify('ñáéíóú'), 'naeiou');

    // ?%$&
    assert.equal(Utils.URLBeautify('?%$&/,.'), '');
});