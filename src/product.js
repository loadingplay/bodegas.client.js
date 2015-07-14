/* globals jQuery */
/* globals Utils */

'use strict';

var Product = function(site_id)
{
    this.site_id = site_id;
};


Product.prototype.list = function(page, items_per_page, callback_or_tags, callback) 
{
    var tags = 'false';
    if (typeof callback_or_tags === 'function')
    {
        callback = callback_or_tags;
    }
    else
    {
        tags = callback_or_tags;
    }

    jQuery.get(Utils.getURL(
        'product', 
        ['list', page, items_per_page, tags]), 
        function(data)
        {
            callback(data.products);
        });
};

Product.prototype.get = function(product_id, callback) 
{
    jQuery.get(Utils.getURL('product', ['get', product_id]), function(product)
    {
        callback(product);
    });
};