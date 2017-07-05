/* globals jQuery */
/* globals Utils */

'use strict';

var VariantsView = function($target)
{
    this.$target = $target;
    this.value_template = '<div class="variant-value" >{{ value }}</div>'
    this.variant_template = '<div class="variant" >\
            <div class="variant-head" >{{ variant_name }}</div>\
            <div class="variant-values"></div>\
        </div>';
};

VariantsView.prototype.renderValues = function(values) 
{
    var variant_builder = [];
    for (var i = 0; i < values.length; i++) 
    {
        variant_builder.push(Utils.render(this.variant_template, values[i]));
    }

    this.$target.html(variant_builder.join(''));
    console.log(this.$target.html());
};
