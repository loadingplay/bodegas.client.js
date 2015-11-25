/* global BodegasClient */
/* global ProductListView */
/* global Utils */
/* global ProductDetailView */
/* global SimpleAnimation*/

'use strict';

(function ( $, window, document, undefined ) 
{
    // Create the defaults once
    var pluginName = 'ecommerce';
    var page = 1;
    var facade;
    var methods = {
        main : function(options)
        {
            methods.init_facade(options);
            facade.showProductList(page);
            page++;

            return facade;
        },
        product_detail : function(options)
        {
            methods.init_facade(options);
            facade.showProductDetail();

            return facade;
        },
        load_more : function()
        {
            facade.showProductList(page);
            page++;

            return facade;
        },
        set_data : function(data)
        {
            facade.setData(data);

            return facade;
        },
        set_shipping_cost : function(data)
        {
            facade.setShippingCost(data);
            return facade;
        },
        init_facade : function(options)
        {
            if (facade === undefined)
            {
                facade = new EcommerceFacade(options);
            }
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
            'checkout_url': 'http://localhost:8522',
            'product_id' : null,
            'animation' : 'none',  // none|basic
            'ignore_stock' : false   // if true, shows all products
        };

        if (typeof(options_or_method) === 'string')
        {
            method = options_or_method;
        }
        else
        {
            options = options_or_method;
        }

        if (method !== 'set_data' && method !== 'set_shipping_cost')
        {
            options = $.extend({}, settings, options);
            Utils.base_url = options.base_url;
        }

        return methods[method](options);
    };

})( jQuery, window, document ); // jshint ignore: line


var EcommerceFacade = function(options)
{
    var self = this;

    this.page = 1;
    this.options = options;
    this.ecommerce = new BodegasClient(this.options.checkout_url);
    this.view  = new ProductListView();
    this.product_view = new ProductDetailView();
    this.animation = null;

    // initialize animation
    if (options.animation !== 'none') 
    {
        // init simmple animations (the only one for now)
        this.animation = new SimpleAnimation();
    }

    this.view.onScrollEnd(function(){
        self.page++;
        self.showProductList(self.page);
    });
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

        var method = self.ecommerce.product.list;

        if (self.options.ignore_stock)
        {
            self.ecommerce.product.listIgnoringStock(
                page, 
                self.options.products_per_page, 
                Utils.getUrlParameter('tag'), 
                Utils.getUrlParameter('search_query'), 
                function(products)
                {
                    self.view.renderProducts(products);
                });
        }
        else
        {
            self.ecommerce.product.list(
                page, 
                self.options.products_per_page, 
                Utils.getUrlParameter('tag'), 
                Utils.getUrlParameter('search_query'), 
                function(products)
                {
                    self.view.renderProducts(products);
                });
        }
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


EcommerceFacade.prototype.setData = function(data) 
{
    if (typeof data === 'object')
    {
        for (var k in data)
        {
            this.ecommerce.cart.extra_info.set_data(k, data[k]);
        }
    }
    else if (typeof data === 'string')
    {
        this.ecommerce.cart.extra_info.set_data('extra', data);
    }
    else
    {
        this.ecommerce.cart.extra_info.set_data('extra', '' + data);
    }
};

EcommerceFacade.prototype.setShippingCost = function(data) 
{
    this.ecommerce.cart.setShippingCost(data);
};