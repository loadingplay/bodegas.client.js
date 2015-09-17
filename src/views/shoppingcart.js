/*global ShoppingCart*/
/*global $*/
/*global Utils*/

'use strict';

var ShoppingCartView = function(controller)
{
    this.controller = controller === undefined ? new ShoppingCart() : controller;
    this.options = {
        cartSelector : '.shopping-cart',
        addToCartbutton : '.add-to-cart',
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one'
    };

    this.$cart_div = $('.shopping-cart');
    this.$cart_container = $('.cart-container');
    this.cart_item_template = $('#shopping-cart-product').html();
    this.total_template = $('#shopping-cart-total').html();
    this.checkout_template = $('#shopping-cart-checkout-form').html();
    this.units_total_template = $('#shopping-cart-units-total').html();

    this.renderLoading();

    this.init();
};

ShoppingCartView.prototype.init = function() 
{
    var self = this;

    $(document).on('click', this.options.addToCartbutton, function(evt)
    {
        evt.preventDefault();
        self.addToCartClick($(this));
        self.render();
    });

    $(document).on('click', this.options.addOne, function(evt)
    {
        evt.preventDefault();
        self.addOneClick($(this));
        self.render();
    });

    $(document).on('click', this.options.removeOne, function(evt)
    {
        evt.preventDefault();
        self.removeOne($(this));
        self.render();
    });

    $(document).on('click', this.options.removeFromCart, function(evt)
    {
        evt.preventDefault();
        self.removeProduct($(this));
        self.render();
    });
    
    this.render();
};


ShoppingCartView.prototype.removeLoading = function() 
{
    var $container = $('.container');
    $('.spinner', $container).remove();
};

ShoppingCartView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.allcontainerLoaded)
    {
        var $container = $('.container');
        $container.append($('#product_loading').html());
    }
};




/**************** button actions ****************/


ShoppingCartView.prototype.addOneClick = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.addProduct(id);
};

ShoppingCartView.prototype.addToCartClick = function($button) 
{
    var id = $button.attr('product-id');
    var name = $button.attr('product-name');
    var price = $button.attr('product-price');
    var upp = $button.attr('product-upp');

    this.controller.addProduct(id, price, name, upp);
};

ShoppingCartView.prototype.removeOne = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.removeOne(id);
};

ShoppingCartView.prototype.removeProduct = function($button) 
{
    var id = $button.attr('product-id');

    this.controller.removeProduct(id);
};


/**************** rendering methos ****************/


ShoppingCartView.prototype.render = function() 
{
    this.$cart_div.html('');
    this.renderProducts(this.$cart_div, this.cart_item_template);
    this.renderTotal(this.$cart_div);
    this.renderUnitsTotal(this.$cart_div);
    this.renderCheckoutData(this.$cart_div);
};

ShoppingCartView.prototype.renderCheckoutData = function($cart_div)
{
    // var guid = this.controller.getGUID();
    // var checkout_url = this.controller.getCheckoutUrl();

    console.log("site id" + this.controller.getSiteId());

    var html = Utils.render(
        this.checkout_template, 
        {
            'site_id' : this.controller.getSiteId(),
            'checkout_url': this.controller.getCheckoutUrl(),
            'cart_id': this.controller.getGUID()
        });

    $('.checkout-form').html(html);
};

ShoppingCartView.prototype.renderProducts = function($cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();
    for (var i = 0; i < productos.length; i++)
    {
        var $builder = $(Utils.render(cart_item_template, productos[i]));
        this.removeLoading();
        $cart_div.append($builder);
        Utils.processPrice($builder);
    }
};

ShoppingCartView.prototype.renderTotal = function($cart_div) 
{
    var $total = $(Utils.render(
        this.total_template, 
        { 
            'total' : this.controller.getTotal()
        }));

    Utils.processPrice($total);
    $cart_div.append($total);
};

ShoppingCartView.prototype.renderUnitsTotal = function($cart_div) 
{
    var $units_total = $(Utils.render(
        this.units_total_template, 
        { 
            'units_total' : this.controller.getUnitsTotal(),
            'upp_total' : this.controller.getUPPTotal()
        }));

    Utils.processPrice($units_total);
    // $cart_div.append($units_total);
    $(".units-total").html($units_total);
};