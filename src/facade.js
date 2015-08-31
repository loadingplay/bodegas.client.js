/* global BodegasClient */
/* global ProductListView */
/* global Utils */
/* global ProductDetailView */

'use strict';

(function ( $, window, document, undefined ) 
{
    // Create the defaults once
    var pluginName = 'ecommerce';
    var page = 1;
    var methods = {
        main : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductList(page);
            page++;

            return facade;
        },
        product_detail : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductDetail();

            return facade;
        },
        load_more : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductList(page);
            page++;

            return facade;
        }
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options_or_method, options ) 
    {
        var method = 'main';
        var settings = {
            'app_public' : 0,
            'products_per_page' : 12,
            'base_url' : 'http://localhost:8520/',
            'product_id' : null
        };

        if (typeof(options_or_method) === 'string')
        {
            method = options_or_method;
        }
        else
        {
            options = options_or_method;
        }

        options = $.extend({}, settings, options);
        Utils.base_url = options.base_url;

        return methods[method](options);
    };

})( jQuery, window, document ); // jshint ignore: line


var EcommerceFacade = function(options)
{
    this.options = options;
    this.ecommerce = new BodegasClient();
    this.view  = new ProductListView();
    this.product_view = new ProductDetailView();
};


EcommerceFacade.prototype.showProductList = function(page) 
{
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.tag.listAll(function(tags)
        {
            self.view.renderTags(tags);
        });

        self.ecommerce.product.list(
            page, self.options.products_per_page, 
            Utils.getUrlParameter('tag'), function(products)
        {
            self.view.renderProducts(products);
        });
    });
};


EcommerceFacade.prototype.showProductDetail = function() 
{
    var product_id = this.options.product_id || Utils.getUrlParameter('id');
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.product.get(product_id, function(product)
        {
            self.product_view.render(product);
        });
    });

};