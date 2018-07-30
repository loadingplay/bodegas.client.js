/* globals jQuery */
/* globals Utils */

'use strict';

var Product = function(site_name)
{
    this.site_name = site_name === undefined ? 0 : site_name;
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

var random_seed; // random seed for random sorting of products

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

    if (column === "random") // Check for random in sorting column
    {
        if(page===1)
            random_seed = Math.random();
        //The column param must be sent as random(some_random_number_or_string) or else API won't recognize it
        column = "random("+random_seed+")";
    }

    jQuery.post(Utils.getURLWithoutParam('product/search'),
        {
            "site_name": this.site_name,
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

                if(page===1)
                    $('.products').empty();
            }

            callback(product_list);
        });
};

Product.prototype.destroy = function()
{
    // nothing here....
};
