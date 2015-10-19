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
    var max_images = parseInt($images.attr('max-images'));  // one by default

    max_images = isNaN(max_images) ? 1 : max_images;

    $.get(url, function(data)
    {
        if (typeof(data) === 'string')
        {
            data = $.parseJSON(data);
        }

        if (max_images === 0)
            max_images = data.images.length;

        for (var i = 0; i < max_images; i++) 
        {
            if (data.images.length > i) 
            {
                $image = $images.clone();
                $image.insertAfter($images);
                src = data.images[i].thumb_500;

                self.loadImageToElement(src, $image);
            }
        }

        $images.remove();

    });

};

ProductDetailView.prototype.loadImageToElement = function(image_url, $el) 
{
    var $aux = $el.clone();
    $aux.load(function()
    {
        $el.replaceWith($aux);
    });
    $aux.fadeOut(function(){
        $aux.attr('src', image_url);
    });
    $aux.fadeIn();
};
