/* global Utils */
/* global $*/

'use strict';

var ProductListView = function()
{
    this.tag_template = '';
    this.product_template = '';

    this.renderLoading();
    this.initTemplates();
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
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

    if (products.length > 0)
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
    var $products = $('.products');
    $products.append($('#product_loading').html());
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