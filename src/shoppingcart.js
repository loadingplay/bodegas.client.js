/*global Utils*/
/*global $*/

'use strict';

var ShoppingCart = function()
{
    console.log("THIS SHOPPINGCART!");
    this.model = [];
    //this.guid = this.generateGUID();
};

ShoppingCart.prototype.generateGUID = function() 
{
    var old_guid = $.cookie('shopping-cart');
    var guid = old_guid;

    if (old_guid === undefined || old_guid === '')
    {
        guid = Utils.createUUID();  // request a new guid
        $.cookie('shopping-cart', guid);  // save to cookie
    }
    return guid;
};

ShoppingCart.prototype.getGUID = function() 
{
    return this.guid;
};

ShoppingCart.prototype.saveModel = function() 
{
    var self = this;
    $.post( 
        Utils.getURL('cart', ['save', this.guid]), 
        { 'json_data' : JSON.stringify(this.model) }, function()
        {
            //nothing here
        });
};

ShoppingCart.prototype.recalcTotals = function() 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        var p = this.model[i];

        p.total = p.quantity * p.price;
    };
};

ShoppingCart.prototype.addProduct = function(id, price, name) 
{
    if (!this.productExist(id))
    {
        this.model.push({ 
            'id' : id, 
            'price' : price, 
            'name' : name, 
            'quantity' : 0,
            'total' : price 
        });
    } 

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity += 1;
            this.model[i].total = this.model[i].quantity * this.model[i].price;
            break;
        }
    }
    
    this.saveModel();
};

ShoppingCart.prototype.removeProduct = function(id) 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (id === this.model[i].id)
        {
            this.model.splice(i, 1);
            return;
        }
    }

    this.saveModel();
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity -= 1;
            this.model[i].total = this.model[i].price * this.model[i].quantity;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }

            return;
        }
    }

    this.saveModel();
};

ShoppingCart.prototype.getProducts = function() 
{
    return this.model;
};

ShoppingCart.prototype.productExist = function(id) 
{
    var pid = parseInt(id);
    // get the product from model, if exist or create from database
    for (var i = 0; i < this.model.length; i++)
    {
        if (parseInt(this.model[i].id) === pid)
        {
            return true;
        }
    }
    return false;
};

ShoppingCart.prototype.getTotal = function() 
{
    var total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        total += product.price * product.quantity;
    }

    return total;
};

ShoppingCart.prototype.loadCart = function(callback) 
{
    var self = this;
    var onload = callback === undefined ? $.noop : callback;

    $.get(Utils.getURL(
        'cart', 
        [
            'load', 
            this.getGUID()
        ]), function(cart_products)
    {
        self.model = cart_products.products;
        self.recalcTotals();
        onload(cart_products);
    });
};