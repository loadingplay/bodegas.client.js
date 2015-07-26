'use strict';

// ==== model ===

var cart_model = [
    {
        name : 'some product name',
        quantity : 0,
        id : 0,
        price : 0
    }
];

// ==== View ====

var CartView = function(controller)
{
    this.controller = controller;
    this.options = {
        cartSelector : '.shopping-cart',
        addToCartbutton : '.add-to-cart',
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one'
    };
};

CartView.prototype.init = function()
{
    var self = this;
    $(document).on('click', this.options.addToCartbutton, function()
                   {
                       var product_id = $(this).attr('product_id');
                       self.controller.addToCart( product_id, 1 );
                   });
    $(document).on('click', this.options.removeFromCart, function()
                   {
                       var product_id = $(this).attr('product_id');
                       self.controller.removeFromCart(product_id);
                   });
    
    $(document).on('click', this.options.addOne, function()
                   {
                       var product_id = $(this).attr('product_id');
                       self.controller.addToCart(product_id, 1);
                   });

    $(document).on('click', this.options.removeOne, function()
                   {
                       var product_id = $(this).attr('product_id');
                       self.controller.addToCart(product_id, -1);
                   });
};


CartView.prototype.render = function()
{
    var products = this.controller.getProducts();
    var $shopping_cart = $(this.options.cartSelector);
    var total = this.controller.getTotal();

    $shopping_cart.html('');

    for (var i = 0; i < products.length; i++)
    {
         var html = '<div>' + products[i].name + 
                    ' | ' + products[i].quantity +
                    '<button class="remove-from-cart" product_id="' + products[i].id + '" >Remove</button>' +
                    '<button class="add-one" product_id="' + products[i].id + '"" >+</button>' +
                    '<button class="remove-one" product_id="' + products[i].id + '" >-</button>' +
                    '<span class="product-total" >' + (products[i].price * products[i].quantity ) + '</span>' +
                    '</div>';
         $shopping_cart.append(html);
    }
    
    $shopping_cart.append('<div>total : ' + total + ' </div>');
};

// ==== Controller ====

var CartController = function()
{
    this.model = cart_model;
    this.view = new CartView(this);

    this.view.init();
    this.view.render();
};

CartController.prototype.getProducts = function()
{
    var prod = [];

    for (var i = 0; i < this.model.length; i++)
    {
        if (this.model[i].quantity > 0)
        {
            prod.push(this.model[i]);
        }
    }

    return prod;
};

CartController.prototype.getTotal = function()
{
    var total = 0;

    for (var i = 0; i < this.model.length; i++)
    {
        total += this.model[i].quantity * this.model[i].price;
    }
    
    return total;
};

CartController.prototype.addToCart = function(product_id, quantity)
{
    var product = this.findProduct(product_id);
    product.quantity += quantity;  // add quantity counter
    
    this.view.render();  // redraw view
};

CartController.prototype.removeFromCart = function(product_id)
{
    var product = this.findProduct(product_id);
    product.quantity = 0;
    
    this.view.render();
};

CartController.prototype.findProduct = function(product_id)
{
    var pid = parseInt(product_id);
    // get the product from model, if exist or create from database
    for (var i = 0; i < this.model.length; i++)
    {
        if (this.model[i].id == pid)
        {
            return this.model[i];
        }
    }
};

CartController.prototype.createProductFromDB = function(data)
{
    //Black magic...
};

/*
$(document).ready(function()
{
    var controller = new CartController();
});
*/