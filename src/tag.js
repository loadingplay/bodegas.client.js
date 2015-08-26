/* globals $*/
/* globals Utils */

'use strict';

var Tag = function(site_id)
{
    this.site_id = site_id;
};

Tag.prototype.listAll = function(callback) 
{
    $.get(Utils.getURL('tag', ['list_all', this.site_id]), function(data)
    {
        callback(data.tags);
    });
};