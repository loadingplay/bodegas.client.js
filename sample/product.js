/* globals BodegasClient */
/* globals Utils */
'use strict';

var SampleProductView = function()
{
    this.template = '';

    this.initTemplates();
};

SampleProductView.prototype.initTemplates = function() 
{
    this.template = $.trim($('#product_detail').html());
};

SampleProductView.prototype.render = function(product) 
{
    var $el = $('.container');
    $el.html(Utils.render(this.template, product));
};


$(document).ready(function()
{
    var ecommerce = new BodegasClient();
    var sample_product_view = new SampleProductView();

    ecommerce.authenticate(function()
    {
        ecommerce.product.get(Utils.getUrlParameter('id'), function(product)
        {
            sample_product_view.render(product);
        });
    });
});