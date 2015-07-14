/* globals Utils */

'use strict';

var Tag = function(site_id)
{
    this.site_id = site_id;
};

Tag.prototype.listAll = function(callback) 
{
    $.get(Utils.getURL('tag', ['list_all']), function(data)
    {
        callback(data.tags);
    });
};