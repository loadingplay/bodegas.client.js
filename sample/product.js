/* globals BodegasClient */
/* globals Utils */
/* globals ProductDetailView */

'use strict';

$(document).ready(function()
{
    var ecommerce = new BodegasClient();
    var sample_product_view = new ProductDetailView();

    ecommerce.authenticate(100, function()
    {
        ecommerce.product.get(Utils.getUrlParameter('id'), function(product)
        {
            sample_product_view.render(product);
        });
    });
});