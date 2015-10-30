/* global Utils */
/* global $*/

'use strict';

var ProductListView = function()
{
    this.all_products_loaded = false;
    this.loading_products = false;
    this.tag_template = '';
    this.product_template = '';
    this.site_search_template = '';
    this.on_scroll_end = $.noop;
    this.site_search = $(".site_search");

    this.renderLoading();
    this.initTemplates();
    this.renderSiteSearch(this.site_search_template);
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
    this.site_search_template = $.trim($('#site_search_template').html());
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

            this.renderProductImage($('.product-image', $rendered), product.id, $('.product-image-href', $rendered));

            if (product.balance_units === 0)
            {
                this.showSoldOut($rendered);
            }

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


ProductListView.prototype.showSoldOut = function($rendered) 
{
    $('.add-to-cart', $rendered).addClass('product-sold-out');
    $('.add-to-cart', $rendered).html('Agotado');  // @todo: add dictionary
    $('.add-to-cart', $rendered).val('Agotado');
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


ProductListView.prototype.renderProductImage = function($image, product_id, $imagehref) 
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
            $aux.fadeOut(function(){
                if($imagehref.length>0){
                    $imagehref.attr("href", src);
                }
                $aux.attr('src', src);
            });
            $aux.fadeIn();
        }
    });
};

ProductListView.prototype.renderSiteSearch = function(template) 
{
    if(this.site_search.length){
        var tag = Utils.getUrlParameter('tag');
        var search_query = Utils.getUrlParameter('search_query');

        if(search_query !== undefined){
            search_query = decodeURIComponent(search_query).replace(/\+/g, ' ');
        }
        var rendered = Utils.render(
                        template, 
                        { 
                            'tag' : tag,
                            'search_query' : search_query
                        });
        this.site_search.append(rendered);

        if(tag === undefined || tag === '') {
            if($("input[name=tag]", this.site_search).length){
                $(".tag-search", this.site_search).css("display","none");
            }
        }

        if($("a.remove-tag", this.site_search).length){
            $("a.remove-tag", this.site_search).on('click', function(){
                $("input[name=tag]", this.site_search).val('');
                $("input[name=search_query]", this.site_search).val($("input[name=search_query]", this.site_search).val());
                $(".btn-search", this.site_search).trigger("click");
            });
        }

        // if(tag !== undefined){
        //     $("#site_search input[name=tag]").tagsInput({
        //         'height':'45px',
        //         'width':'auto',
        //         'defaultText':''
        //     });
        // }
        // $("#site_search input[name=search_query]").tagEditor({ initialTags: tag.split(",") });
    }
};
