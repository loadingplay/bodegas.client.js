/*global ShoppingCart*/
/*global $*/

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

    this.init();
};

ShoppingCartView.prototype.renderView = function(cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();
    for (var i = 0; i < productos.length; i++)
    {
        var builder = cart_item_template;
        builder = builder.replace("{{ id }}", productos[i].id);
        builder = builder.replace("{{ name }}", productos[i].name);
        builder = builder.replace("{{ price }}", productos[i].price);
        cart_div.append(builder);
    }

    if (productos.length != 0)
    {
        cart_div.append('<span> Some Total: xxx </span>');
    }    
}

ShoppingCartView.prototype.init = function() 
{
    var self = this;
    var cart_div = $('.shopping-cart');
    var cart_item_template = $('#product_template').html();
    console.log('________' + cart_item_template);

    $(document).on('click', this.options.addToCartbutton, function()
    {
        var $button = $(this);
        var id = $button.attr('product-id');
        var name = $button.attr('product-name');
        var price = $button.attr('product-price');

        self.controller.addProduct(id, price, name);
        self.renderView(cart_div, cart_item_template);

        console.log(self.controller.getProducts());
    });

    $(document).on('click', this.options.removeFromCart, function()
    {
        var $button = $(this);
        var id = $button.attr('product-id');

        self.controller.removeProduct(id);
        self.renderView(cart_div, cart_item_template);

        console.log(self.controller.getProducts());
    });

    $(document).on('click', this.options.addOne, function()
    {
        var $button = $(this);
        var id = $button.attr('product-id');

        self.controller.addOne(id);
        self.renderView(cart_div, cart_item_template);

        console.log(self.controller.getProducts());
    });

    $(document).on('click', this.options.removeOne, function()
    {
        var $button = $(this);
        var id = $button.attr('product-id');

        self.controller.removeOne(id);
        self.renderView(cart_div, cart_item_template);

        console.log(self.controller.getProducts());
    });
};