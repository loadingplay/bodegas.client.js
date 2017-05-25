/* globals jQuery */
/* globals Utils */

'use strict';

var Product = function(site_id)
{
    this.site_id = site_id === undefined ? 0 : site_id;
};

Product.prototype.list = function(page, items_per_page, callback_or_tags, search_query, user, operator, column, direction, callback) 
{
    this._list(page, items_per_page, false, callback_or_tags, search_query, user, operator, column, direction, callback);
};

Product.prototype.listIgnoringStock = function(page, items_per_page, callback_or_tags, search_query, user, operator, column, direction, callback) 
{
    this._list(page, items_per_page, true, callback_or_tags, search_query, user, operator, column, direction, callback);
};

Product.prototype.get = function(product_id, user_or_callback, callback) 
{
    var user = typeof(user_or_callback) === 'function' ? '' : user_or_callback;
    callback = typeof(user_or_callback) === 'function' ? user_or_callback : callback;
    callback = callback === undefined ? jQuery.noop : callback;

    jQuery.get(
        Utils.getURL('product', ['get', product_id]), 
        { 'user' : user },
        function(product)
        {
            callback(product);
        });
};

Product.prototype._list = function(page, items_per_page, ignore_stock, callback_or_tags, search_query, user, operator, column, direction, callback) 
{
    var tags = 'false';
    var product_list = [];
    var term = '';

    if (typeof callback_or_tags === 'function')
    {
        callback = callback_or_tags;
    }
    else
    {
        tags = callback_or_tags;
    }

    if (tags === undefined || tags === '')
    {
        tags = 'false';
    }

    if (typeof search_query === 'function')
    {
        callback = search_query;
    }
    else if(search_query!==undefined)
    {
        term = search_query;
    }

    //@todo: Add validation for correct spelling of column sort word.

    jQuery.post(Utils.getURLWithoutParam('product/search'), 
        {
            "site_id": this.site_id, 
            "page": page, 
            "items_per_page": items_per_page, 
            "tags": tags, 
            "ignore_stock": ignore_stock,
            "search_query": decodeURIComponent(term),
            "search": true,
            "user" : user,
            "operator" : operator,
            "column" : column,
            "direction" : direction
        },
        function(data)
        {
            if (data.products !== undefined)
            {
                product_list = data.products;
            }

            callback(product_list);
        });
};


Product.prototype.destroy = function() 
{
    // nothing here....
};
