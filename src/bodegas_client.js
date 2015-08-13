/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */
/* global ShoppingCart */


'use strict';

var BodegasClient = function()
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
};

BodegasClient.prototype.authenticate = function(app_public, callback) 
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init();
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_id) 
{
    this.site_id = site_id;
    this.tag = new Tag(site_id);
    this.product = new Product(site_id);
    this.cart = new ShoppingCart();
};