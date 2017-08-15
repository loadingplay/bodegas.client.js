/* globals jQuery */
/* globals Utils */

'use strict';

var VariantsView = function($target)
{
    this.$target = $target;
    this.value_template = '<div class="variant-value" >{{ value }}</div>'
    this.variant_template = '<div class="variant" >\
            <div class="variant-head" >{{ variant_name }}</div>\
            <div class="variant-values">{{ values }}</div>\
        </div>';
};

/**
 * render a single value, and return the html
 * @param  {[type]} value json value to be rendered
 * @example:
 *     [{
            "site_name": "me_NBK-SACO-NEGRA-C168", 
            "id": 1, 
            "value": "1", 
            "variant_name": "talla"
        }, ...]
    @return html string with values
 */
VariantsView.prototype.renderValues = function(values) 
{
    var values_builder = [];

    for (var i = 0; i < values.length; i++)
    {
        values_builder.push(
            Utils.render(this.value_template, values[i])
        );
    }

    return values_builder.join('');
};

/**
 * render a list of values
 * @param  {[type]} values  a list of variants wuthin values inside
 * @example:
 *     [{
            "values": [{
                "site_name": "me_NBK-SACO-NEGRA-C168", 
                "id": 1, 
                "value": "1", 
                "variant_name": "talla"
            },...], 
            "variant_name": "talla"
        },...];
 * @return {string}          html string with variants
 */
VariantsView.prototype.renderVariants = function(variants) 
{
    var variant_builder = [];
    for (var i = 0; i < variants.length; i++) 
    {
        console.log(this.renderValues(variants[i].values));
        var rendered = Utils.render(
            this.variant_template, 
            {
                'variant_name': variants[i].variant_name,
                'values': this.renderValues(variants[i].values)
            });

        variant_builder.push(rendered);
    }

    return variant_builder.join('');
};

/**
 * render variants and place inside $target
 * @param  {[type]} variants list of variants
 */
VariantsView.prototype.render = function(variants) 
{
    this.$target.html(this.renderVariants(variants));
};


/**
 * return currently selected variant
 * @return {string} a string describing selected variant 
 *                  i.e [sku]-[variant0]-...[variant n]
 */ 
VariantsView.prototype.getSelectedCombination = function() 
{
    return '';
};
