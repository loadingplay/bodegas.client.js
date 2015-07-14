/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */


'use strict';

var BodegasClient = function()
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
};

BodegasClient.prototype.authenticate = function(callback) 
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [10]), function(data)
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
};