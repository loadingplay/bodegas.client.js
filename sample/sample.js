/* global BodegasClient */
/* global Utils */

'use strict';

var SampleView = function()
{
    this.tag_template = '';
    this.product_template = '';

    this.initTemplates();
};

SampleView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
};

SampleView.prototype.renderTags = function(tags) 
{
    var $menu = $('.menu ul');
    for (var i = 0; i < tags.length; i++) 
    {
        var tag = tags[i];
        var rendered = Utils.render(this.tag_template, tag);

        $menu.append(rendered);
    }
};


SampleView.prototype.renderProducts = function(products) 
{
    var $products = $('.products');
    for (var i = 0; i < products.length; i++) 
    {
        var product = products[i];
        var rendered = Utils.render(this.product_template, product);

        $products.append(rendered);
    }
};


$(document).ready(function()
{
    var ecommerce = new BodegasClient();
    var sample_view = new SampleView();

    ecommerce.authenticate(function()
    {
        ecommerce.tag.listAll(function(tags)
        {
            // console.log(tags);
            sample_view.renderTags(tags);
        });

        ecommerce.product.list(1, 10, function(products)
        {
            sample_view.renderProducts(products);
        });
    });
});