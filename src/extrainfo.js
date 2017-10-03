/* global $ */
/* global Utils */

'use strict';

var ExtraInfo = function(cart_id)
{
    this.model = {};
    this.cart_id = cart_id;
};

ExtraInfo.prototype.set_data = function(index, data)
{
    if (this._isValidIndex(index))
    {
        this.model[index] = data;

        this.synchronize();
        return true;
    }

    return false;
};

ExtraInfo.prototype.get_data = function(index)
{
    try
    {
        return this.model[index];
    }
    catch(ex)
    {
        // nothing here
    }

    return false;
};


/******* private methods *********/

/**
 * only string and numbers are valid
 * @param  {object}  index this value will be validated
 * @return {Boolean}       true if is string or number
 */
ExtraInfo.prototype._isValidIndex = function(index)
{
    if (typeof(index) === 'string')
        return true;

    if (!isNaN(parseInt(index)))
        return true;

    return false;
};

ExtraInfo.prototype.synchronize = function()
{
    var json_string = JSON.stringify(this.model);
    console.log(this.model);
    $.post(
        Utils.getURLWithoutParam('v1/cart/' + this.cart_id + '/extrainfo'),
        {'data' : json_string},
        function()
        {
            // nothing here...
        });
};
