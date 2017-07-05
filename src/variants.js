/* globals jQuery */
/* globals Utils */

'use strict';

var Variants = function(options)
{
    var options = options || {};
    this.site_name = options.site_name || '';
};

/**
 * load variants from API
 * @param  {stirng}   product_sku the product identifier
 * @param  {Function} cb         callback
 */
Variants.prototype.get = function(product_sku, cb) 
{
    jQuery.get(
        Utils.getURL('v1', ['variant', 'list']), 
        {
            'site_name': this.site_name + '_' + product_sku
        },
        function(v)
        {
            cb(v.variants);
        }
    );
};


/**
 * load values from API
 * @param  {string}   product_sku  the product sku
 * @param  {stirng}   variant_name the variant name or comma separated names
 * @param  {Function} cb           callback method
 */
Variants.prototype.getValues = function(product_sku, variant_name, cb) 
{
    jQuery.get(
        Utils.getURL('v1', ['variant', 'value', 'list']),
        {
            'site_name': this.site_name + '_' + product_sku,
            'variant': variant_name
        },
        function(v)
        {
            cb(v.values);
        }
    );
};
