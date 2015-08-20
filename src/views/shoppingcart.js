/*global ShoppingCart*/
/*global $*/
/*global Utils*/

'use strict';

var ShoppingCartView = function(controller)
{
    console.log("shopping cart view motherfucker!");
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

    this.init();
};

ShoppingCartView.prototype.init = function() 
{
    var self = this;
    console.log("INITED CART VIEW!");

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

    this.controller.addProduct(id, price, name);
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
    this.renderCheckoutData(this.$cart_div, this.$cart_container);
};

ShoppingCartView.prototype.renderCheckoutData = function($cart_div, $cart_container)
{
    var guid = this.controller.getGUID();
    var session_id = this.controller.getSessionId();
    var failure_url = this.controller.getFailureUrl();
    var success_url = this.controller.getSuccessUrl();
    var webpay_url = this.controller.getWebpayUrl();
    var checkout_url = this.controller.getCheckoutUrl();

    $('input[name=order_id]', $cart_container).val(guid);
    $('input[name=success_url]', $cart_container).val(success_url);
    $('input[name=failure_url]', $cart_container).val(failure_url);
    $('input[name=webpay_url]', $cart_container).val(webpay_url);
    $('input[name=session_id]', $cart_container).val(session_id);
    $("#shipping-form", $cart_container).attr('action', checkout_url);
};

ShoppingCartView.prototype.renderProducts = function($cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();
    for (var i = 0; i < productos.length; i++)
    {
        var builder = Utils.render(cart_item_template, productos[i]);
        $cart_div.append(builder);
    }
};

ShoppingCartView.prototype.renderTotal = function($cart_div) 
{
    var total = Utils.render(this.total_template, { 'total' : this.controller.getTotal() });
    $cart_div.append(total);
};
