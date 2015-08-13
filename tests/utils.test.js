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