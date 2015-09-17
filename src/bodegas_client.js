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
    this.tag = new Tag(site_id);
    this.product = new Product(site_id);
    this.cart = new ShoppingCart(site_id, this.checkout_url);
};