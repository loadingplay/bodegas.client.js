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
