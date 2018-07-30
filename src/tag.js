/* globals $*/
/* globals Utils */

'use strict';

var Tag = function(site_name)
{
    this.site_name = site_name === undefined ? 0 : site_name;
};

Tag.prototype.listAll = function(callback)
{
    $.get(Utils.getURL('tag', ['list_all', this.site_name]), function(data)
    {
        callback(data.tags);
    });
};
