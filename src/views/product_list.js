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
    var $products_view = $('.products');

    if (products.length > 0)
    {
        for (var i = 0; i < products.length; i++) 
        {
            var product = products[i];

            var $rendered = $(Utils.render(this.product_template, product));
            Utils.processPrice($rendered);

            this.renderProductImage($('.product-image', $rendered), product.id);

            $products_view.append($rendered);
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
            var src = data.images[0].thumb_500;
            var $aux = $image.clone();

            $aux.load(function()
            {
                $image.replaceWith($aux);
            });
            $aux.attr('src', src);
        }
    });
};