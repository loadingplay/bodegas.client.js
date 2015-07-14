/* global BodegasClient */
/* global ProductListView */
/* global Utils */
/* global ProductDetailView */

'use strict';

(function ( $, window, document, undefined ) {
    
    // Create the defaults once
    var pluginName = 'ecommerce';
    var methods = {
        main : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductList();

            return facade;
        },
        product_detail : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductDetail();

            return facade;
        }
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options_or_method, options ) 
    {
        var method = 'main';

        if (typeof(options_or_method) === 'string')
        {
            method = options_or_method;
        }
        else
        {
            options = options_or_method;
        }

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


EcommerceFacade.prototype.showProductList = function() 
{
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.tag.listAll(function(tags)
        {
            self.view.renderTags(tags);
        });

        self.ecommerce.product.list(
            1, 12, 
            Utils.getUrlParameter('tag'), function(products)
        {
            self.view.renderProducts(products);
        });
    });
};


EcommerceFacade.prototype.showProductDetail = function() 
{
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.product.get(
            Utils.getUrlParameter('id'), function(product)
        {
            self.product_view.render(product);
        });
    });

};