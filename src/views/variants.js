/* globals document */
/* globals jQuery */
/* globals $ */
/* globals Utils */

var VariantsView = function($target)
{
    this.$target = $target;
    this.variants = [];
    this.value_template = '<div class="variant-value" variant="{{ variant_name }}" value="{{ value }}" >{{ value }}</div>';
    this.variant_template = '<div class="variant" >\
            <div class="variant-head">{{ variant_name }}</div>\
            <div class="variant-values">{{ values }}</div>\
        </div>';

    this.active_class = 'value-active';

    this.selected_values = [];

    // triggers
    this.initEvents();
};
/**
 * change default templates for a brand new template
 * @param {string} variant_template template for variant container
 * @param {string} value_template   template for value container
 */
VariantsView.prototype.setTemplates = function(variant_template, value_template)
{
    this.variant_template = variant_template !== '' ? variant_template : this.variant_template;
    this.value_template = value_template !== '' ? value_template : this.value_template;
};

/**
 * get initialized all click events on the variants GUI
 */
VariantsView.prototype.initEvents = function()
{
    var self = this;
    // $(document).on('click', $('.variant-value', $(this.$target)), function()
    var valueClick = function()
    {
        self.selectVariant($(this).attr('variant'), $(this).attr('value'));
        // ad active class
        $('.' + self.active_class, $(self.$target)).removeClass(self.active_class);
        $(this).addClass(self.active_class);

        if (self.isValidCombination())
        {
            $(self.$target).trigger('combination:selected', [self.getSelectedCombination()]);
        }
    };
    $(document).on('click', '.variant-value', valueClick);
    // $(this.$target).on('click', '.variant-value', valueClick);
};

VariantsView.prototype.selectVariant = function(variant, value)
{
    var variant_value = { "variant": variant, "value": value };

    // check if the variant was already selected
    for (var i = 0; i < this.selected_values.length; i++)
    {
        if (this.selected_values[i].variant === variant)
        {
            this.selected_values[i].value = value;
            return;
        }
    }

    this.selected_values.push(variant_value);
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
    this.variants = variants;
    $(this.$target).html(this.renderVariants(variants));
};


/**
 * return currently selected variant
 * @return {string} a string describing selected variant
 *                  i.e [sku]-[variant0]-...[variant n]
 */
VariantsView.prototype.getSelectedCombination = function()
{
    var builder = [];

    // only join values
    for (var i = 0; i < this.selected_values.length; i++)
    {
        builder.push(this.selected_values[i].value);
    }
    return builder.join('-');
};

/**
 * check if all variants have a selected value
 */
VariantsView.prototype.isValidCombination = function()
{
    return this.variants.length === this.selected_values.length;
};
