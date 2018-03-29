/* globals jQuery */
/* globals Utils */


/**
 * Variant class definition
 * @param  {object} options options comming from facade
 */
var Variants = function(options)
{
    // options = options === undefined ? { 'site_name': 'xx' } : options;
    var opt = options === undefined ? { 'site_name': 'none' }:options;
    this.site_name = opt.site_name;
};

/**
 * load variants from API
 * @param  {string}   product_sku the product identifier
 * @param  {Function} cb         callback
 */
Variants.prototype.get = function(product_sku, cb)
{
    var self = this;
    jQuery.get(
        Utils.getURL('v1', ['variant']),
        {
            'site_name': this.site_name,
            'sku': product_sku
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
 * @param  {string}   variant_name the variant name or comma separated names
 * @param  {Function} cb           callback method
 */
Variants.prototype.getValues = function(product_sku, variant_name, cb)
{
    jQuery.get(
        Utils.getURL('v1', ['variant', variant_name, 'value']),
        {
            'site_name': this.site_name,
            'sku': product_sku
        },
        function(v)
        {
            cb(v.values);
        }
    );
};

/**
 * load combination from API
 * @param  {string}   product_sku the product identifier
 * @param  {Function} cb         callback
 */
Variants.prototype.getCombination = function(product_sku, cb)
{
    var self = this;
    jQuery.get(
        Utils.getURL('v1', ['variant', product_sku, 'combination']),
        {
            'site_name': this.site_name,
            'sku': product_sku
        },
        function(v)
        {
            cb(v.combinations);
        }
    );
};
