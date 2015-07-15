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
        var settings = {
            'app_public' : 0,
            'products_per_page' : 10,
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
            callback(data.products);
        });
};

Product.prototype.get = function(product_id, callback) 
{
    jQuery.get(Utils.getURL('product', ['get', product_id]), function(product)
    {
        callback(product);
    });
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
    base_url : 'http://localhost:8520/',
    getURL : function(module, args) 
    {
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
    $el.html(Utils.render(this.template, product));
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
        var rendered = Utils.render(this.product_template, product);

        $products.append(rendered);
    }
};
