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
        /** just override main method */
        product_list: function(options)
        {
            return methods.main.call(this, options);
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
        load_variants: function(options)
        {
            var f = methods.init_facade.call(this, options);
            f.loadVariants();
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
            else
            {
                f.changeOptions(options);
            }

            return f;
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
            options = $.extend(true, {}, $.fn[pluginName].defaults, options);
            options.onLoad = options.onLoad === undefined ? $.noop : options.onLoad.clone();

            // TODO: remove this fix once all is site name for ever
            if (options.site_name === "")
            {
                options.site_name = options.app_public;
            }

            Utils.base_url = options.base_url;
        }

        if (this[0] instanceof Document)
        {
            // @deprecated: old code
            return methods[method].call(this, options);
        }
        else
        {
            // new version
            return $(this).each(function()
            {
                options.container = $(this);
                methods[method].call($(this), options);
            });
        }
    };

    $.fn[pluginName].defaults = {
        /********* COMMON **********/
        'app_public'            : 0,
        'base_url'              : 'https://apibodegas.loadingplay.com/',
        //'base_url'              : 'http://apibodegas.onev.today/',

        /********* PRODUCTBOX **********/
        'tag'                   : '',
        'maxProducts'           : 2,
        'templateOrigin'        : '.product_template',
        'onLoad'                : $.noop,

        /********* OTHER **********/
        'checkout_url'          : 'https://pay.loadingplay.com',
        'products_per_page'     : 12,
        'animation'             : 'none',  // none|basic|ghost
        'ignore_stock'          : false,   // if true, shows all products
        'product_id'            : null,
        'infinite_scroll'       : true,
        'analytics'             : '',  // analytics code
        'container'             : null,  // @deprecated: use $([target]).ecommerce instead
        'user'                  : '',
        'operator'              : 'or', // solo se puede pasar mas de 1 tag con operator and, or solo funciona con 1 tag
        'column'                : 'main_price', // columna de la tabla por la cual se quiere ordenar "main_price, name, sku, etc". Por defecto se ordena por "main_price"
        'direction'             : 'asc', // orientación del orden, asc (ascendiente) o desc (descendiente). Por defecto es asc
        'deactivate_product'    : false,

        /******* TEMPLATES *******/
        'no_products_template'  : '<span class="fuentes2" >No tenemos productos en esta sección por el momento</span>',

        /******* VARIABLES ********/
        'product_sku'           : '',  // use this instead of product_id
        'site_name'             : '',  // use this instead of app_public

        /***** PRODUCT VARIANTS *******/
        'variants': {
            'product_sku': '',
            'container': '',  // variants warpper
            'variant_template': '',  // ''  for use default
            'value_template': '', // '' for use default
            'active_class': 'value-active'  // this class is added when a value is selected
        },

        /**** CART ****/
        'afterModelUpdate': $.noop,
        'afterModelSave': $.noop
    };

})( jQuery, window, document ); // jshint ignore: line


var EcommerceFacade = function(options)
{
    var self = this;

    this.page = 1;
    this.options = options;
    this.ecommerce = new BodegasClient(this.options);
    this.view  = new ProductListView(this.options.container);
    this.view.no_products_template = this.options.no_products_template;
    this.product_view = new ProductDetailView(this.options.container);

    // variants init
    this.variants = new Variants(options);
    this.variants_view = new VariantsView(this.options.variants.container);
    this.variants_view.active_class = this.options.variants.active_class;
    this.variants_view.setTemplates(
        this.options.variants.variant_template,
        this.options.variants.value_template
    );

    this.ecommerce.cart.getCurrentCombination = function()
    {
        return self.variants_view.getSelectedCombination();
    };

    this.ecommerce.cart.afterModelUpdate = this.options.afterModelUpdate;
    this.ecommerce.cart.afterModelSave = this.options.afterModelSave;

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

    if (this.options === undefined || !this.options.hasOwnProperty('app_public'))
    {
        console.error('you must select an app id or name');
        return;
    }

    self.ecommerce.tag.listAll(function(tags)
    {
        self.view.renderTags(tags);
    });

    var tag = '';
    if (self.options.tag !== '')
    {
        tag = self.options.tag;
    }
    else
    {
        tag = Utils.getUrlParameter('tag');
    }

    if (self.options.deactivate_product)
        return;

    self.ecommerce.product._list(
        page,
        self.options.products_per_page,
        self.options.ignore_stock,
        tag,
        Utils.getUrlParameter('search_query'),
        self.options.user,
        self.options.operator,
        self.options.column,
        self.options.direction,
        function(products)
        {
            self.view.renderProducts(
                products,
                page,
                function(products)
                {
                    if (self.options !== undefined)
                    {
                        self.options.onLoad.call(this, products);
                    }

                    self.triggerProductsLoaded(products);
                }
            );
        }
    );
};

EcommerceFacade.prototype.showProductDetail = function()
{
    // deactivate product render
    if (this.options.deactivate_product)
        return;

    var product_id = this.options.product_id || Utils.getUrlParameter('id');
    var self = this;
    self.ecommerce.product.get(
        product_id,
        self.options.user,
        function(product)
        {
            self.product_view.render(
                product,
                function(products)
                {
                    self.options.onLoad.call(this, products);
                    self.triggerProductsLoaded(products);
                }
            );
        }
    );

};


/**
 * load variants from api and render them in jquery target
 */
EcommerceFacade.prototype.loadVariants = function()
{
    var product_sku = this.options.variants.product_sku ||
        Utils.getUrlParameter('sku');
    var self = this;

    // ensure templates and target
    this.variants_view.$target = this.options.variants.container;
    this.variants_view.setTemplates(
        this.options.variants.variant_template,
        this.options.variants.value_template
    );
    this.variants_view.product_sku = product_sku;

    self.variants.getCombination(
        product_sku,
        function(variants)
        {
            var sku_list = [];

            for (var i = 0; i < variants.length; i++)
            {
                sku_list.push(variants[i].sku);
            }

            var cellar_id = 0;

            jQuery.get(
                Utils.getURL('v1', ['cellar', self.variants.site_name]),
                {},
                function(response)
                {
                    cellar_id = response.cellar.id;

                    jQuery.get(
                        Utils.getURL('v1', ['cellar', cellar_id, 'product/']),
                        {
                            'sku_list': sku_list.join(",")
                        },
                        function(response)
                        {
                            for (var i = 0; i < response.products.length; i++)
                            {
                                var sku = response.products[i].product_sku;
                                var stock = response.products[i].balance_units;
                                self.variants_view.productStock[sku] = stock;
                            }

                            // trigger variant stock loaded
                            self.triggerVarianStockLoaded(self.variants_view.productStock);
                        }
                    );
                }
            );
        }
    );


    // load variants from database
    self.variants.get(
        product_sku,
        function(variants)
        {
            var vs = [];

            for (var i = 0; i < variants.length; i++)
            {
                vs.push(variants[i].name);
            }

            self.variants.getValues(
                product_sku, vs.join(","), function(variants)
                {
                    self.variants_view.render(variants);
                    self.options.onLoad.call(this, variants);
                    self.triggerVariantsLoaded(variants);
                }
            );
        }
    );
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

/**
 * trigger event when products are loaded
 * @param  {string} event event to trigger
 */
EcommerceFacade.prototype.triggerProductsLoaded = function(products)
{
    $(this.options.container).trigger('products.loaded', [products]);
};

/**
 * this event get triggered when all variants are loaded
 * @param  {list} variants variants list
 */
EcommerceFacade.prototype.triggerVariantsLoaded = function(variants)
{
    $(this.options.container).trigger('variants.loaded', [variants]);
};

/**
 * this method is executed once all variants are loaded within skus inside
 * @param  {string} variants    dictionary with variants and stock
 */
EcommerceFacade.prototype.triggerVarianStockLoaded = function(variants)
{
    $(this.options.container).trigger('variants_stock_loaded', [variants]);
};

/**
 * change options
 * @param  {object} options json object with options
 */
EcommerceFacade.prototype.changeOptions = function(options)
{
    this.options = options;

    // @todo: change other options
};
