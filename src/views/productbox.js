/*global $*/
/*global Utils*/

'use strict';


var ProductBoxView = function(controller)
{
    this.controller = controller;
};

ProductBoxView.prototype.getTemplate = function()
{
    return $(this.controller.template_origin).html();
};

ProductBoxView.prototype.productsLoaded = function(product_list)
{
    var template = this.getTemplate();

    for (var i = 0; i < product_list.length; i++)
    {
        var product = product_list[i];
        var rendered = Utils.render(template, product);

        this.controller.$container.append(rendered);
    }
};

ProductBoxView.prototype.render = function(cb)
{
    cb = cb || $.noop;
    var self = this;

    this.controller.loadProducts(function(products){
        self.productsLoaded(products);

        self.controller.onLoad.call(self.controller.$container, products);  // event
        cb();
    });
};
