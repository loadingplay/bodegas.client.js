/* global jQuery */
/* global Utils */
/* global Cart */
/* global Tag */
/* global Product */


'use strict';

var BodegasClient = function(options={})
{
    this.app_public = '1000';
    this.site_name = options.site_name === undefined ? '' : options.site_name
    this.tag = null;
    this.checkout_url = options.checkout_url === undefined ? '' : options.checkout_url;

    this.tag = new Tag();
    this.product = new Product();
    this.cart = new Cart(this.checkout_url, this.site_name);
};

BodegasClient.prototype.authenticate = function(app_public, callback)
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init(self.site_name);
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_name)
{
    this.site_name = site_name;
    this.tag.site_name = site_name;
    this.product.site_name = site_name;

    this.cart.site_name = site_name;
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
