/* global ProductListView */
/* global BodegasClient */
/* global Utils */

'use strict';

$(document).ready(function()
{
    var ecommerce = new BodegasClient();
    var sample_view = new ProductListView();

    ecommerce.authenticate(100, function()
    {
        ecommerce.tag.listAll(function(tags)
        {
            // console.log(tags);
            sample_view.renderTags(tags);
        });

        ecommerce.product.list(1, 12, Utils.getUrlParameter('tag'), function(products)
        {
            sample_view.renderProducts(products);
        });
    });
});