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

ShoppingCartView.prototype.init = function() 
{
    var self = this;
    $(document).on('click', this.options.addToCartbutton, function()
    {
        var $button = $(this);
        var id = $button.attr('product-id');
        var name = $button.attr('product-name');
        var price = $button.attr('product-price');

        self.controller.addProduct(id, price, name);

        console.log(self.controller.getProducts());
    });
};