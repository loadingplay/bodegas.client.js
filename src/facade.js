/* global BodegasClient */
/* global ProductListView */
/* global Utils */
/* global ProductDetailView */
/* global SimpleAnimation*/
/* global ProductBox*/
/* global window*/

(function ( $, window, document, undefined ) 
{
    'use strict';

    // test
    Function.prototype.clone = function() {
        var that = this;
        var temp = function temporary() { return that.apply(this, arguments); };
        for(var key in this) {
            if (this.hasOwnProperty(key)) {
                temp[key] = this[key];
            }
        }
        return temp;
    };

    // Create the defaults once
    var pluginName = 'ecommerce';
    var page = 1;

    var methods = {
        main: function(options)
        {
            var f = methods.init_facade.call(this, options);
            f.showProductList(page);
            page++;

            return f;
        },
        product_detail: function(options)
        {
            var f = methods.init_facade.call(this, options);
            f.showProductDetail();
            return f;
        },
        load_more: function()
        {
            var f = methods.init_facade.call(this);
            f.showProductList(page);
            page++;

            return f;
        },
        set_data: function(data)
        {
            var f = methods.init_facade.call(this);
            f.setData(data);

            return f;
        },
        set_shipping_cost: function(data)
        {
            var f = methods.init_facade.call(this);
            f.setShippingCost(data);
            return f;
        },
        init_facade: function(options)
        {
            var f = this.data(pluginName);
            if (f === undefined || f === '')
            {
                f = new EcommerceFacade(options);
                this.data(pluginName, f);
            }

            return f;
        },
        product_box: function(options)
        {
            $(this).each(function()
            {
                var data = $.data(this, 'product_box');

                if (!data || data === undefined) 
                {
                    var product_box = new ProductBox($(this), options);
                    product_box.view.render();

                    $.data(this, 'product_box', product_box);
                }
            });

            return $(this);
        },
        destroy: function(options)
        {
            var f = methods.init_facade.call(this, options);
            if (f !== undefined)
            {
                $(this).data(pluginName, '');
                f.destroy();
                f = undefined;
            }
            page = 1;
        }
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function( options_or_method, options ) 
    {
        var method = 'main';
        var settings = {
            /********* COMMON **********/
            'app_public'            : 0,
            'base_url'              : 'http://localhost:8520/',

            /********* PRODUCTBOX **********/
            'tag' : '',
            'maxProducts' : 2,
            'templateOrigin' : '.product_template',
            'onLoad' : $.noop,

            /********* OTHER **********/
            'checkout_url'          : 'http://localhost:8522',
            'products_per_page'     : 12,
            'animation'             : 'none',  // none|basic|ghost
            'ignore_stock'          : false,   // if true, shows all products
            'product_id'            : null,
            'infinite_scroll'       : true,
            'analytics'             : '',  // analytics code
            'container'             : '.container',
            'user'                  : '',
            'operator'              : 'or', //solo se puede pasar mas de 1 tag con operator and , or solo funciona con 1 tag



            //Sort by 'value', aun en prueba 
            'sortBy' : 'none', //price, description, name, brand, etc.
            'sortOrientation' : 'none', //atributo que aun no se implementa, muesta el orden descendiente o ascendiente

            /******* TEMPLATES *******/
            'no_products_template' : '<span class="fuentes2" >No tenemos productos en esta sección por el momento</span>'
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
            options.onLoad = options.onLoad === undefined ? $.noop : options.onLoad.clone();

            Utils.base_url = options.base_url;
        }

        return methods[method].call($(this), options);
    };

})( jQuery, window, document ); // jshint ignore: line


var EcommerceFacade = function(options)
{
    var self = this;

    this.page = 1;
    this.options = options;
    this.ecommerce = new BodegasClient(this.options.checkout_url);
    this.view  = new ProductListView();
    this.view.no_products_template = this.options.no_products_template;
    this.product_view = new ProductDetailView(this.options.container);
    this.animation = null;

    // initialize animation
    if (options.animation === 'basic') 
    {
        // init simmple animations (the only one for now)
        this.animation = new SimpleAnimation();
    }

    // initialize ghost animation
    if (options.animation === 'ghost')
    {
        this.animation = new GhostAnimation();
    }

    // initialize analytics
    if (options.analytics !== '' && window.ga !== undefined)
    {
        this.ecommerce.enableGA();
        this.product_view.enableGA();
    }
    // infinite scroll
    if (options.infinite_scroll)
    {
        this.view.onScrollEnd(function(){
            self.page++;
            self.showProductList(self.page);
        });
    }else{
        this.view.onClickEnd(function()
        {
            self.page++;
            self.showProductList(self.page);
        });
    }
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
        // var method = self.ecommerce.product.list;
        var tag='';

        if (self.options.tag !== '')
        {
            tag=self.options.tag;
        }
        else
        {
            tag=Utils.getUrlParameter('tag');
        }

        if (self.options.ignore_stock)
        {
            self.ecommerce.product.listIgnoringStock(
                page, 
                self.options.products_per_page, 
                tag, 
                Utils.getUrlParameter('search_query'), 
                self.options.user,
                self.options.operator,
                function(products)
                {
                    self.view.renderProducts(products, page, self.options.onLoad);
                },
                self.options.sortBy, //Este parámetro entrega el tipo de orden de los productos
                self.option.sortOrientation
            );
        }
        else
        {
            self.ecommerce.product.list(
                page, 
                self.options.products_per_page, 
                tag, 
                Utils.getUrlParameter('search_query'), 
                self.options.user,
                self.options.operator,
                function(products)
                {
                    self.view.renderProducts(products, page, self.options.onLoad);
                },
                self.options.sortBy, //Este parámetro entrega el tipo de orden de los productos
                self.options.sortOrientation
            );
        }
    });
};

EcommerceFacade.prototype.showProductDetail = function() 
{
    var product_id = this.options.product_id || Utils.getUrlParameter('id');
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.product.get(
            product_id, 
            self.options.user,
            function(product)
        {
            self.product_view.render(
                product,
                self.options.onLoad);
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


EcommerceFacade.prototype.destroy = function() 
{
    this.ecommerce.destroy();
    this.view.destroy();
};
