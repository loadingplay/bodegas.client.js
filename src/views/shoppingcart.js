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
    this.cart_item_template = $('#product_template').html();

    this.init();
};

ShoppingCartView.prototype.init = function() 
{
    var self = this;

    $(document).on('click', this.options.addToCartbutton, function()
    {
        self.addToCartClick($(this));
        self.render();
    });

    $(document).on('click', '.add-one', function()
    {
        self.addOneClick($(this));
        self.render();
    });


    // $(document).on('click', this.options.removeFromCart, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.removeProduct(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });

    // $(document).on('click', this.options.addOne, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.addOne(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });

    // $(document).on('click', this.options.removeOne, function()
    // {
    //     var $button = $(this);
    //     var id = $button.attr('product-id');

    //     self.controller.removeOne(id);
    //     self.renderView(cart_div, cart_item_template);

    //     console.log(self.controller.getProducts());
    // });
};

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

// ************ render methods ***************

ShoppingCartView.prototype.render = function() 
{
    this.$cart_div.html('');
    this.renderProducts(this.$cart_div, this.cart_item_template);
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
    $cart_div.append('<span> Some Total: xxx </span>');
};
