/* globals Utils */
/* globals $*/
'use strict';

var ProductDetailView = function(container)
{
    this.template = '';
    this.is_ga_enabled = false;
    this.container = container || '.container';

    this.initTemplates();
};

ProductDetailView.prototype.initTemplates = function() 
{
    this.template = $.trim($('#product_detail').html());

    if (this.template === '')
    {
        this.template = '<div>no product template</div>';
    }

    this.renderLoading();
};

ProductDetailView.prototype.render = function(product, callback) 
{
    callback = callback === undefined ? $.noop : callback;
    var $el = $(this.container);
    var $prod = $(Utils.render(this.template, product));
    var $images = $('.image', $prod);

    this.renderImages($images, product.id);

    this.removeLoading();
    $el.append($prod);
    Utils.processPrice($prod);

    callback.call($el, product);

    this.sendPageView(product);

//SE IMPLEMENTA DICCIONARIO DE ANALYTICS

    var dict = {
        ga_id: product.id,
        ga_name: product.name,
        ga_tag: product.tags,
        ga_price: product.main_price,
    };

    $.analytics("product-detail", dict);
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
                src = data.images[counter].thumb_500;
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
    $aux.fadeOut(function(){
        $aux.attr('src', image_url);
    });
    $aux.fadeIn();
};

ProductDetailView.prototype.enableGA = function() 
{
    this.is_ga_enabled = true;
};

ProductDetailView.prototype.sendPageView = function(product) 
{
    try
    {
        window.ga('ec:addImpression', {
          'id': product.id,
          'name': product.name,
          'price' : product.main_price,
          'type': 'view'
        });

        window.ga('ec:setAction', 'detail');
        window.ga('send', 'pageview');
    }
    catch(e)
    {
        // nothing here...
    }
};


ProductDetailView.prototype.removeLoading = function() 
{
    var $container = $(this.container);
    $('.spinner', $container).remove();
};

ProductDetailView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.allcontainerLoaded)
    {
        var $container = $(this.container);
        $container.append($('#product_loading').html());
    }
};
