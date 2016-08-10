/*global Utils*/
/*global $*/
/*global ShoppingCartView*/
/*global ExtraInfo*/

'use strict';

var ShoppingCart = function(site_id, checkout_url)
{
    this.shipping_cost = 0;
    this.extra_info = new ExtraInfo(1);
    this.model = [];
    this.guid = this.generateGUID();
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;
    this.site_id = site_id === undefined ? 2 : site_id;
    this.view = new ShoppingCartView(this);

    // google analytics
    this.is_ga_enabled = true;

    this.loadCart();
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

    this.extra_info.cart_id = guid;
    return guid;
};

ShoppingCart.prototype.getGUID = function() 
{
    return this.guid;
};

ShoppingCart.prototype.getCheckoutUrl = function() 
{
    return this.checkout_url;
};

ShoppingCart.prototype.getSiteId = function() 
{
    return this.site_id;
};

ShoppingCart.prototype.saveModel = function(callback) 
{
    var self=this;
    $.post( 
        Utils.getURL('cart', ['save', this.guid]), 
        { 'json_data' : JSON.stringify(this.model) }, function(e)
        {
            (callback === undefined ? $.noop:callback)(e);
            // self.loadCart();
        });
};

ShoppingCart.prototype.recalcTotals = function() 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        var p = this.model[i];

        p.total = p.quantity * p.price;
        p.upp_total = p.quantity * p.upp;
    }
};

ShoppingCart.prototype.addProduct = function(id, price, name, upp, bullet1, bullet2, bullet3, img, callback) 
{
    bullet1 = bullet1 === undefined ? '' : bullet1;
    bullet2 = bullet2 === undefined ? '' : bullet2;
    bullet3 = bullet3 === undefined ? '' : bullet3;
    img = img === undefined ? '' : img;

    var images = [];
    var im = [];
    for (var i = 0; i < 3; i++) 
    {
        images.push(img);
    }

    im.push(images)
    if (!this.productExist(id))
    {
        // upp = upp === undefined ? 1 : upp;  // protect this value

        this.model.push({ 
            'id' : parseInt(id), 
            'price' : price, 
            'name' : name, 
            'quantity' : 0,
            'upp': upp,
            'upp_total' : upp,
            'total' : price,
            'bullet_1': bullet1,
            'bullet_2': bullet2,
            'bullet_3': bullet3,
            'images' : im
        });
    }

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity += 1;
            this.model[i].total = this.model[i].quantity * this.model[i].price;
            this.model[i].upp_total = this.model[i].quantity * this.model[i].upp;
            this.model[i].bullet_1 = this.model[i].bullet_1;
            this.model[i].bullet_2 = this.model[i].bullet_2;
            this.model[i].bullet_3 = this.model[i].bullet_3;
            this.saveModel(callback);
            this.gaAddProduct(this.model[i], i);

            return;
        }
    }

};

ShoppingCart.prototype.removeProduct = function(id) 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (parseInt(id) === this.model[i].id)
        {
            this.gaRemoveProduct(this.model[i]);
            this.model.splice(i, 1);
            this.saveModel();
            return;
        }
    }
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity -= 1;
            this.model[i].total = this.model[i].price * this.model[i].quantity;
            this.model[i].upp_total = this.model[i].quantity * this.model[i].upp;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }

            this.saveModel();
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

ShoppingCart.prototype.getTotal = function() 
{
    var total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        total += product.price * product.quantity;
    }
    total += this.shipping_cost;

    return total;
};

ShoppingCart.prototype.getUnitsTotal = function() 
{
    var units_total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        units_total += product.quantity;
    }

    // console.log("units total " + units_total);

    return units_total;
};

/** upp == units per product */
ShoppingCart.prototype.getUPPTotal = function() 
{
    var units_total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        units_total += parseInt(product.upp_total);
    }

    // console.log("upp units total " + units_total);
    return units_total;
};

ShoppingCart.prototype.loadCart = function(callback) 
{
    var self = this;
    var onload = callback === undefined ? $.noop : callback;

    var url = Utils.getURL(
        'cart', [
            'load',
            this.getGUID()
        ]);

    $.ajax({
        url: url,
        cache: false,
        success: function(cart_products){
            if (cart_products.expired)
            {
                $.removeCookie('shopping-cart');
                self.guid = self.generateGUID();
                onload([]);
                return;
            }
            // console.log(cart_products.products);
            self.model = cart_products.products;
            self.recalcTotals();
            self.view.render();

            onload(cart_products);
        }
    });
};

ShoppingCart.prototype.setShippingCost = function(shipping_cost) 
{
    this.shipping_cost = shipping_cost;
    this.view.render();
};

/**
 * set google analytics enhanced for ecommerce enabled
 * @param  {function} ga google analytics function
 */
ShoppingCart.prototype.enableGA = function() 
{
    this.is_ga_enabled = true;

    window.ga( 'require', 'ec');
};

ShoppingCart.prototype.gaAddProduct = function(product, position) 
{
    try
    {
        if (this.is_ga_enabled)
        {
            this.gaSetProduct(product, position);

            window.ga( 'ec:setAction', 'add');
            window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
            // window.ga( 'ec:setAction', 'add');
            // window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
        }
    }
    catch(e)
    {
        // nothing here...
    }
};

ShoppingCart.prototype.gaRemoveProduct = function(product) 
{
    try
    {
        if (this.is_ga_enabled)
        {
            this.gaSetProduct(product, 0);

            window.ga( 'ec:setAction', 'remove');
            window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
        }
    }
    catch(e)
    {
        // nothin here...
    }
};

ShoppingCart.prototype.gaSetProduct = function(product, position) 
{
    window.ga( 'ec:addProduct', {
      'id': product.id,
      'name': product.name,
      'price' : product.main_price,
      'position': position
    });
};

ShoppingCart.prototype.clearCart = function(callback) 
{
    this.model = [];
    this.saveModel(callback);
};
