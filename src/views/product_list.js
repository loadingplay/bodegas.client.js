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
