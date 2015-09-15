/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */
/* global ShoppingCart */


'use strict';

var BodegasClient = function(checkout_url)
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;
};

BodegasClient.prototype.authenticate = function(app_public, callback) 
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init(app_public);
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_id) 
{
    this.site_id = site_id;
    this.tag = new Tag(site_id);
    this.product = new Product(site_id);
    this.cart = new ShoppingCart(site_id, this.checkout_url);
};
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
    var facade;
    var methods = {
        main : function(options)
        {
            facade = new EcommerceFacade(options);
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
        load_more : function()
        {
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
            'checkout_url': 'http://localhost:8522',
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
    var self = this;

    this.page = 1;
    this.options = options;
    this.ecommerce = new BodegasClient(this.options.checkout_url);
    this.view  = new ProductListView();
    this.product_view = new ProductDetailView();


    this.view.onScrollEnd(function(){
        self.page++;
        self.showProductList(self.page);
    });
};


EcommerceFacade.prototype.showProductList = function(page) 
{
    console.log(page);
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
    var product_list = [];

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

    jQuery.get(Utils.getURL(
        'product', 
        ['list', this.site_id, page, items_per_page, tags]), 
        function(data)
        {
            if (data.products !== undefined)
            {
                product_list = data.products;
            }
            callback(product_list);
        });
};

Product.prototype.get = function(product_id, callback) 
{
    jQuery.get(Utils.getURL('product', ['get', product_id]), function(product)
    {
        callback(product);
    });
};
/*global Utils*/
/*global $*/
/*global ShoppingCartView*/

'use strict';

var ShoppingCart = function(site_id, checkout_url)
{
    this.model = [];
    this.guid = this.generateGUID();
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;
    this.site_id = site_id === undefined ? 2 : site_id;
    this.view = new ShoppingCartView(this);

    this.loadCart();
};

ShoppingCart.prototype.generateGUID = function() 
{
    var old_guid = $.cookie('shopping-cart');
    var guid = old_guid;

    if (old_guid === undefined || old_guid === '')
    {
        guid = Utils.createUUID();  // request a new guid
        $.cookie('shopping-cart', guid);  // save to cookie
    }
    return guid;
};

ShoppingCart.prototype.getGUID = function() 
{
    return this.guid;
};

ShoppingCart.prototype.getCheckoutUrl = function() 
{
    return this.checkout_url;
};

ShoppingCart.prototype.getSiteId = function() 
{
    return this.site_id;
};

ShoppingCart.prototype.saveModel = function() 
{
    $.post( 
        Utils.getURL('cart', ['save', this.guid]), 
        { 'json_data' : JSON.stringify(this.model) }, function()
        {
            //nothing here
        });
};

ShoppingCart.prototype.recalcTotals = function() 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        var p = this.model[i];

        p.total = p.quantity * p.price;
    }
};

ShoppingCart.prototype.addProduct = function(id, price, name) 
{
    if (!this.productExist(id))
    {
        this.model.push({ 
            'id' : parseInt(id), 
            'price' : price, 
            'name' : name, 
            'quantity' : 0,
            'total' : price 
        });
    } 

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity += 1;
            this.model[i].total = this.model[i].quantity * this.model[i].price;
            this.saveModel();
            return;
        }
    }
};

ShoppingCart.prototype.removeProduct = function(id) 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (parseInt(id) === this.model[i].id)
        {
            this.model.splice(i, 1);
            this.saveModel();
            return;
        }
    }
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity -= 1;
            this.model[i].total = this.model[i].price * this.model[i].quantity;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }

            this.saveModel();
            return;
        }
    }

};

ShoppingCart.prototype.getProducts = function() 
{
    return this.model;
};

ShoppingCart.prototype.productExist = function(id) 
{
    var pid = parseInt(id);
    // get the product from model, if exist or create from database
    for (var i = 0; i < this.model.length; i++)
    {
        if (parseInt(this.model[i].id) === pid)
        {
            return true;
        }
    }
    return false;
};

ShoppingCart.prototype.getTotal = function() 
{
    var total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        total += product.price * product.quantity;
    }

    return total;
};

ShoppingCart.prototype.getUnitsTotal = function() 
{
    var units_total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        units_total += product.quantity;
    }

    return units_total;
};

ShoppingCart.prototype.loadCart = function(callback) 
{
    var self = this;
    var onload = callback === undefined ? $.noop : callback;

    $.get(Utils.getURL(
        'cart', 
        [
            'load', 
            this.getGUID()
        ]), function(cart_products)
    {
        self.model = cart_products.products;
        self.recalcTotals();
        self.view.render();

        onload(cart_products);
    });
};
/* globals $*/
/* globals Utils */

'use strict';

var Tag = function(site_id)
{
    this.site_id = site_id;
};

Tag.prototype.listAll = function(callback) 
{
    $.get(Utils.getURL('tag', ['list_all', this.site_id]), function(data)
    {
        callback(data.tags);
    });
};
/*global $*/
'use strict';

var Utils = {  //jshint ignore: line
    base_url : 'http://apibodegas.ondev.today/',
    strEndsWith : function(str, suffix)
    {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    getURL : function(module, args) 
    {
        if (!Utils.strEndsWith(Utils.base_url, '/'))
        {
            Utils.base_url += '/';
        }

        var url = Utils.base_url + module + '/';

        if (args)
        {
            url += args.join('/');
        }

        return url;
    },
    render : function(template, data)
    {
        if (template === undefined) return '';
        var builder = template;

        for(var d in data)
        {
            var reg = new RegExp('\\{{2}(\\s|)' + d + '(\\s|)\\}{2}');

            while (builder.split(reg).length > 1)
            {
                builder = builder.replace(reg, data[d]);
            }
        }

        return builder;
    },
    getUrlParameter: function(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) 
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) 
            {
                return sParameterName[1];
            }
        }
    },
    createUUID : function() 
    {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        var uuid = s.join('');
        return uuid;
    },
    /**
     * return an string with number formatted as price I.E $2.000
     * @param  {Number} n number to convert
     * @param  {Number} c decimal counter, by default 0
     * @param  {String} d decimal separator, by defailt ","
     * @param  {String} t unit separator, by default "."
     * @return {String}   string with price formatted number.
     */
    formatMoney : function(n, c, d, t)
    {
        c = isNaN(c = Math.abs(c)) ? 0 : c;
        d = d === undefined ? ',' : d;
        t = t === undefined ? '.' : t;
        var s = n < 0 ? '-' : '';
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '';
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return '$ ' + s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    },
    processPrice : function($tag)
    {
        $('.money', $tag).each(function()
        {
            var html = $(this).html();
            $(this).html(Utils.formatMoney(html));
        });
    }
};


/* globals Utils */
'use strict';

var ProductDetailView = function()
{
    this.template = '';

    this.initTemplates();
};

ProductDetailView.prototype.initTemplates = function() 
{
    this.template = $.trim($('#product_detail').html());
};

ProductDetailView.prototype.render = function(product) 
{
    var $el = $('.container');
    var $prod = $(Utils.render(this.template, product));
    var $images = $('.image', $prod);

    this.renderImages($images, product.id);

    $el.append($prod);
    Utils.processPrice($prod);
};

ProductDetailView.prototype.renderImages = function($images, product_id) 
{
    var self = this;
    var src = '';
    var $image = null;
    var url = Utils.getURL('product', ['images', product_id]);
    var counter = 0;

    $.get(url, function(data)
    {
        if (typeof(data) === 'string')
        {
            data = $.parseJSON(data);
        }

        $images.each(function()
        {
            if (data.images.length > counter)
            {
                src = data.images[0].thumb_500;
                $image = $($images[counter]); // ensure jquery element
                self.loadImageToElement(src, $image);
            }

            counter++;
        });
    });

};

ProductDetailView.prototype.loadImageToElement = function(image_url, $el) 
{
    var $aux = $el.clone();
    $aux.load(function()
    {
        $el.replaceWith($aux);
    });

    $aux.attr('src', image_url);
};

/* global Utils */
/* global $*/

'use strict';

var ProductListView = function()
{
    this.all_products_loaded = false;
    this.loading_products = false;
    this.tag_template = '';
    this.product_template = '';
    this.on_scroll_end = $.noop;

    this.renderLoading();
    this.initTemplates();
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());

    this.init();
};


ProductListView.prototype.init = function() 
{
    var self = this;
    $(document).on('scroll', function()
    {
        if (self.loading_products) return;  // if this flag is enabled then don`t load

        var $products = $('.products');
        var $loading = $('.spinner', $products);

        // check if loading is in viewport
        if($(window).scrollTop() >= $(document).height() - $(window).height() - 400)
        {
            self.loading_products = true;
            self.on_scroll_end();
        }
    });
};

ProductListView.prototype.onScrollEnd = function(callback) 
{
    this.on_scroll_end = callback;
};

ProductListView.prototype.renderTags = function(tags) 
{
    // detect if tags are list
    if (tags === undefined) return;

    var $menu = $('.menu ul');
    for (var i = 0; i < tags.length; i++) 
    {
        var tag = tags[i];
        var rendered = Utils.render(this.tag_template, tag);

        $menu.append(rendered);
    }
};


ProductListView.prototype.renderProducts = function(products) 
{
    var $products = $('.products');

    if ($products.length > 0)
    {
        for (var i = 0; i < products.length; i++) 
        {
            var product = products[i];

            var $rendered = $(Utils.render(this.product_template, product));
            Utils.processPrice($rendered);

            this.renderProductImage($('.product-image', $rendered), product.id);

            $products.append($rendered);
        }

        this.renderLoading();
    }
    else
    {
        this.all_products_loaded = true;
        this.removeLoading();
    }
};


ProductListView.prototype.removeLoading = function() 
{
    var $products = $('.products');
    $('.spinner', $products).remove();
};

ProductListView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.all_products_loaded)
    {
        var $products = $('.products');
        $products.append($('#product_loading').html());
    }

    this.loading_products = false;
};


ProductListView.prototype.renderProductImage = function($image, product_id) 
{
    var url = Utils.getURL('product', ['images', product_id]);

    $.get(url, function(data)
    {
        if (typeof(data) === 'string')
        {
            data = $.parseJSON(data);
        }

        if (data.images.length > 0)
        {
            var src = data.images[0].thumb_200;
            var $aux = $image.clone();

            $aux.load(function()
            {
                $image.replaceWith($aux);
            });
            $aux.attr('src', src);
        }
    });
};
/*global ShoppingCart*/
/*global $*/
/*global Utils*/

'use strict';

var ShoppingCartView = function(controller)
{
    this.controller = controller === undefined ? new ShoppingCart() : controller;
    this.options = {
        cartSelector : '.shopping-cart',
        addToCartbutton : '.add-to-cart',
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one'
    };

    this.$cart_div = $('.shopping-cart');
    this.$cart_container = $('.cart-container');
    this.cart_item_template = $('#shopping-cart-product').html();
    this.total_template = $('#shopping-cart-total').html();
    this.checkout_template = $('#shopping-cart-checkout-form').html();
    this.units_total_template = $('#shopping-cart-units-total').html();

    this.renderLoading();

    this.init();
};

ShoppingCartView.prototype.init = function() 
{
    var self = this;

    $(document).on('click', this.options.addToCartbutton, function(evt)
    {
        evt.preventDefault();
        self.addToCartClick($(this));
        self.render();
    });

    $(document).on('click', this.options.addOne, function(evt)
    {
        evt.preventDefault();
        self.addOneClick($(this));
        self.render();
    });

    $(document).on('click', this.options.removeOne, function(evt)
    {
        evt.preventDefault();
        self.removeOne($(this));
        self.render();
    });

    $(document).on('click', this.options.removeFromCart, function(evt)
    {
        evt.preventDefault();
        self.removeProduct($(this));
        self.render();
    });
    
    this.render();
};


ShoppingCartView.prototype.removeLoading = function() 
{
    var $container = $('.container');
    $('.spinner', $container).remove();
};

ShoppingCartView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.allcontainerLoaded)
    {
        var $container = $('.container');
        $container.append($('#product_loading').html());
    }
};




/**************** button actions ****************/


ShoppingCartView.prototype.addOneClick = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.addProduct(id);
};

ShoppingCartView.prototype.addToCartClick = function($button) 
{
    var id = $button.attr('product-id');
    var name = $button.attr('product-name');
    var price = $button.attr('product-price');

    this.controller.addProduct(id, price, name);
};

ShoppingCartView.prototype.removeOne = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.removeOne(id);
};

ShoppingCartView.prototype.removeProduct = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.removeProduct(id);
};


/**************** rendering methos ****************/


ShoppingCartView.prototype.render = function() 
{
    this.$cart_div.html('');
    this.renderProducts(this.$cart_div, this.cart_item_template);
    this.renderTotal(this.$cart_div);
    this.renderUnitsTotal(this.$cart_div);
    this.renderCheckoutData(this.$cart_div);
};

ShoppingCartView.prototype.renderCheckoutData = function($cart_div)
{
    // var guid = this.controller.getGUID();
    // var checkout_url = this.controller.getCheckoutUrl();

    console.log("site id" + this.controller.getSiteId());

    var html = Utils.render(
        this.checkout_template, 
        {
            'site_id' : this.controller.getSiteId(),
            'checkout_url': this.controller.getCheckoutUrl(),
            'cart_id': this.controller.getGUID()
        });

    $('.checkout-form').html(html);
};

ShoppingCartView.prototype.renderProducts = function($cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();
    for (var i = 0; i < productos.length; i++)
    {
        var $builder = $(Utils.render(cart_item_template, productos[i]));
        this.removeLoading();
        $cart_div.append($builder);
        Utils.processPrice($builder);
    }
};

ShoppingCartView.prototype.renderTotal = function($cart_div) 
{
    var $total = $(Utils.render(
        this.total_template, 
        { 
            'total' : this.controller.getTotal()
        }));

    Utils.processPrice($total);
    $cart_div.append($total);
};

ShoppingCartView.prototype.renderUnitsTotal = function($cart_div) 
{
    var $units_total = $(Utils.render(
        this.units_total_template, 
        { 
            'units_total' : this.controller.getUnitsTotal()
        }));

    Utils.processPrice($units_total);
    // $cart_div.append($units_total);
    $(".units-total").html($units_total);
};