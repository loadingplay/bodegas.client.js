/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */


'use strict';

var BodegasClient = function()
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
};

BodegasClient.prototype.authenticate = function(app_public, callback) 
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init();
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_id) 
{
    this.site_id = site_id;
    this.tag = new Tag(site_id);
    this.product = new Product(site_id);
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
        var settings = {
            'app_public' : 0,
            'products_per_page' : 10,
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
            1, self.options.products_per_page, 
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
        ['list', page, items_per_page, tags]), 
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
'use strict';

var ShoppingCart = function()
{
    this.model = [];
};

ShoppingCart.prototype.addProduct = function(id, price, name) 
{
    if (!this.productExist(id))
    {
        this.model.push({ 
            'id' : id, 
            'price' : price, 
            'name' : name, 
            'quantity' : 0,
            'total' : price 
        });
    }

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity += 1;
            this.model[i].total = this.model[i].quantity * this.model[i].price;
        }
    }
};

ShoppingCart.prototype.removeProduct = function(id) 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (id === this.model[i].id)
        {
            this.model.splice(i, 1);
            return;
        }
    }
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity -= 1;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }
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
/* globals Utils */

'use strict';

var Tag = function(site_id)
{
    this.site_id = site_id;
};

Tag.prototype.listAll = function(callback) 
{
    $.get(Utils.getURL('tag', ['list_all']), function(data)
    {
        callback(data.tags);
    });
};
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

'use strict';

var ProductListView = function()
{
    this.tag_template = '';
    this.product_template = '';

    this.initTemplates();
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
};

ProductListView.prototype.renderTags = function(tags) 
{
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
    for (var i = 0; i < products.length; i++) 
    {
        var product = products[i];
        console.log(Utils.render(this.product_template, product));
        var $rendered = $(Utils.render(this.product_template, product));

        this.renderProductImage($('.product-image', $rendered), product.id);

        $products.append($rendered);
    }
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
    this.cart_item_template = $('#product_template').html();

    this.init();
};

ShoppingCartView.prototype.init = function() 
{
    var self = this;

    $(document).on('click', this.options.addToCartbutton, function()
    {
        self.addToCartClick($(this));
        self.render();
    });

    $(document).on('click', '.add-one', function()
    {
        self.addOneClick($(this));
        self.render();
    });


    // $(document).on('click', this.options.removeFromCart, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.removeProduct(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });

    // $(document).on('click', this.options.addOne, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.addOne(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });

    // $(document).on('click', this.options.removeOne, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.removeOne(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });
};

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

// ************ render methods ***************

ShoppingCartView.prototype.render = function() 
{
    this.$cart_div.html('');
    this.renderProducts(this.$cart_div, this.cart_item_template);
};

ShoppingCartView.prototype.renderProducts = function($cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();
    for (var i = 0; i < productos.length; i++)
    {
        var builder = Utils.render(cart_item_template, productos[i]);
        $cart_div.append(builder);
    }
};

ShoppingCartView.prototype.renderTotal = function($cart_div) 
{
    $cart_div.append('<span> Some Total: xxx </span>');
};
