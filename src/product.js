/* globals jQuery */
/* globals Utils */

'use strict';

var Product = function(site_id)
{
    this.site_id = site_id === undefined ? 0 : site_id;
};

Product.prototype.list = function(page, items_per_page, callback_or_tags, search_query, user, operator, callback, sortBy, sortOrientation) 
{
    this._list(page, items_per_page, false, callback_or_tags, search_query, user, operator, callback, sortBy, sortOrientation);
};

Product.prototype.listIgnoringStock = function(page, items_per_page, callback_or_tags, search_query, user, operator, callback, sortBy, sortOrientation) 
{
    this._list(page, items_per_page, true, callback_or_tags, search_query, user, operator, callback, sortBy, sortOrientation);
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

Product.prototype._list = function(page, items_per_page, ignore_stock, callback_or_tags, search_query, user, operator, callback, sortBy, sortOrientation) 
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
            "sortBy" : sortBy,
            "sortOrientation" : sortOrientation
        },
        function(data)
        {
            if (data.products !== undefined)
            {
                product_list = data.products;
            }

            //sortBy llega como parámetro de Product.prototype.list
            //console.log(sortBy); //Muestra que tipo de orden seguirán los productos.
                        
            //Ordena los productos por el atributo main_price en forma descendiente.
            if(sortBy==="main_price") //Se puede reemplazar con un switch(sortBy)
            {
                //Simple método de burbuja para ordenar los elementos de product_list
                var aux;
                for (var i = 0; i < product_list.length-1; i++) 
                {
                    for (var j = 0; j < product_list.length-1; j++) 
                    {
                        if(product_list[j].main_price < product_list[j+1].main_price)
                        {
                            aux = product_list[j];

                            product_list[j] = product_list[j+1];

                            product_list[j+1] = aux;
                        }
                    }
                }
            }
            //Ordena los productos por su nombre
            if(sortBy==="name"){
                var aux;
                for (var i = 0; i < product_list.length-1; i++) 
                {
                    for (var j = 0; j < product_list.length-1; j++) 
                    {
                        if(product_list[j].name > product_list[j+1].name)
                        {
                            aux = product_list[j];

                            product_list[j] = product_list[j+1];

                            product_list[j+1] = aux;
                        }
                    }
                }
            }

            callback(product_list);
        });
};


Product.prototype.destroy = function() 
{
    // nothing here....
};
