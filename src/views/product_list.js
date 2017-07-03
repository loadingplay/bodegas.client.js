/* global Utils */
/* global $ */
/* global window */
/* global document */
/* global console */

'use strict';

var ProductListView = function($target)
{
    this.all_products_loaded = false;
    this.loading_products = false;
    this.tag_template = '';
    this.product_template = '';
    this.site_search_template = '';
    this.on_scroll_end = $.noop;
    this.on_click_end = $.noop;
    this.site_search = $('.site_search');
    this.no_products_template = '';
    this.$target = $target === undefined ? $('.products') : $($target);

    // PRIVATE VARS 
    var self = this;
    this._onScroll = function()
    {

        if (self.loading_products) return;  // if this flag is enabled then don`t load

        var $products = self.$target;
        var $loading = $('.spinner', $products);

        // check if loading is in viewport
        if($(window).scrollTop() >= $(document).height() - $(window).height() - 400)
        {
            self.loading_products = true;
            self.on_scroll_end();
        }
    };

    this._onClick = function()
    {
        var $products = self.$target;
        var $loading = $('.spinner', $products);

        // check if loading is in viewport
        self.loading_products = true;
        self.on_click_end();
    };

    // INNIT
    this.renderLoading();
    this.initTemplates();
    this.renderSiteSearch(this.site_search_template);
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
    this.site_search_template = $.trim($('#site_search_template').html());

    if (this.product_template === '')
    {
        this.product_template = '<div>no product template</div>';
    }

    this.init();
};


ProductListView.prototype.init = function() 
{
    $(document).on('scroll', this._onScroll);
    $(document).on('click', '.more-products', this._onClick);
};

ProductListView.prototype.onScrollEnd = function(callback) 
{
    this.on_scroll_end = callback;
};

ProductListView.prototype.onClickEnd = function(callback) 
{
    this.on_click_end = callback;
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

/**
 * render error instead of product list
 * @param  {[type]}   $products_view [description]
 * @param  {[type]}   products       [description]
 * @param  {[type]}   page           [description]
 * @param  {Function} callback       [description]
 * @return {[type]}                  [description]
 */
ProductListView.prototype.renderEmpty = function(products, page, callback) 
{
    if (page === 1)
    {
        this.$target.html(this.no_products_template);
    }
    this.all_products_loaded = true;
    this.removeLoading();

    // finish rendering
    this.finishRendering(page, products, callback);
};

/**
 * finishes the product rendering
 * @param  {[type]}   page     [description]
 * @param  {[type]}   products [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
ProductListView.prototype.finishRendering = function(page, products, callback) 
{
    this.page = page;
    callback.call(this, products);
};

/**
 * render a single product and return the html
 * @param  {[type]} product [description]
 * @return {[type]}         [description]
 */
ProductListView.prototype.renderProduct = function(product) 
{
    var $rendered = $(Utils.render(this.product_template, product));
    this.renderProductImage($('.product-image', $rendered), product.id, $('.product-image-href', $rendered));

    if (product.balance_units === 0)
    {
        this.showSoldOut($rendered);
    }

    return $rendered;
};

ProductListView.prototype.renderProducts = function(products, page, callback) 
{
    var rendered;
    var html_builder = []

    // some validations
    products = products === null?[]:products;
    page = isNaN(parseInt(page)) ? 1:page;
    callback = typeof callback === 'function' ? callback: $.noop;

    // when product list is empty then show error
    if (products.length <= 0)
    {
        this.renderEmpty(products, page, callback);
        return
    }

    // render product list
    for (var i = 0; i < products.length; i++) 
    {
        html_builder.push(
            this.renderProduct(products[i])
        );
    }
    this.$target.append(html_builder);
    Utils.processPrice(this.$target);

    // finish renering process
    this.renderLoading();
    this.finishRendering(page, products, callback);
};


ProductListView.prototype.showSoldOut = function($rendered) 
{
    $('.add-to-cart', $rendered).addClass('product-sold-out');
    $('.add-to-cart', $rendered).html('Agotado');  // @todo: add dictionary
    $('.add-to-cart', $rendered).val('Agotado');
};

ProductListView.prototype.removeLoading = function() 
{
    $('.spinner', this.$target).remove();
    $('.more-products').css('display', 'none');
};

ProductListView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.all_products_loaded)
    {
        this.$target.append($('#product_loading').html());
        $('.more-products').css('display', 'block');
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
                    $imagehref.attr('href', src);
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
            if($('input[name=tag]', this.site_search).length){
                $('.tag-search', this.site_search).css('display','none');
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


ProductListView.prototype.destroy = function() 
{
    try 
    {
        this.$target.html("");
        $(document).unbind('scroll', this._onScroll);
        $(document).unbind('click',  this._onClick);
    }
    catch(ex)
    {
        console.log("method unbind not found in this jquery version : " + ex);
    }
};
