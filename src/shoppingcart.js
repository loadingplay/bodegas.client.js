'use strict';

var ShoppingCart = function()
{
    this.model = [];
};

ShoppingCart.prototype.addProduct = function(id, price, name) 
{
    if (!this.productExist(id))
    {
        this.model.push({ 'id' : id, 'price' : price, 'name' : name, 'quantity' : 0 });
    }

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity += 1;
        }
    }
};

ShoppingCart.prototype.addOne = function(id)
{
    //Si esta accesible esta funcion es pq ya existe el producto.
    /*
    if (!this.productExist(id)) 
    {
        this.model.push({ 'id' : id, 'price' : price, 'name' : name, 'quantity' : 0 });
    }*/
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity += 1;
        }
    }
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
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === id)
        {
            this.model[i].quantity -= 1;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }
            return;
        }
    }
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