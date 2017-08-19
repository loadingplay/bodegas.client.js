/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */
/* global ShoppingCart */


'use strict';

var BodegasClient = function(checkout_url)
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;

    this.tag = new Tag();
    this.product = new Product();
    this.cart = new ShoppingCart();
};

BodegasClient.prototype.authenticate = function(app_public, callback)
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init(app_public);
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_id)
{
    this.site_id = site_id;
    this.tag.site_id = site_id;
    this.product.site_id = site_id;

    this.cart.site_id = site_id;
    this.cart.checkout_url = this.checkout_url;
    this.cart.loadCart();
};


BodegasClient.prototype.enableGA = function()
{
    this.cart.enableGA();
};


BodegasClient.prototype.destroy = function()
{
    this.product.destroy();
};
