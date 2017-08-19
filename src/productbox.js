/*global $*/
/*global ProductBoxView*/

'use strict';

var ProductBox = function($div, options)
{
    options = options || {};


    this.max_products = options.maxProducts || 10;
    this.template_origin = options.templateOrigin || '';
    this.app_public = options.app_public || 1;
    this.base_url = options.base_url || 'http://apibodegas.ondev.today/';
    this.tag = options.tag || '';
    this.onLoad = options.onLoad || $.noop;
    this.$container = $div || $('<div></div>');
    this.ignore_stock = options.ignore_stock ? 'true' : 'false';

    this.view = new ProductBoxView(this);
};

ProductBox.prototype.getURL = function()
{
    var len = this.base_url.length;
    var base_url_limit = this.base_url.slice(len-1, len) === '/' ? 1 : 0;
    var base_url = this.base_url.substr(0, len - base_url_limit);

    var url = [base_url,
                'product/list',
                this.app_public,
                1,
                this.max_products,
                (this.tag === '' ? 'false' : this.tag),
                this.ignore_stock].join('/');

    return url;
};


ProductBox.prototype.loadProducts = function(callback)
{
    callback = callback || $.noop;

    $.get(this.getURL(), function(json)
    {
        callback(json.products);
    });
};
