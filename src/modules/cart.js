/*jshint esversion: 6 */
/*global Utils*/
/*global $*/
/*global ShoppingCartView*/
/*global ExtraInfo*/
/*global window*/

class Cart extends Module
{
    constructor(site_id, checkout_url, site_name)
    {
        super();

        this.checkout_url = checkout_url === undefined ? '' : checkout_url;
        this.site_id = site_id === undefined ? 2 : site_id;
        this.site_name = site_name === undefined ? "" : site_name;

        this.onLoadCart = $.noop;
        this.onSaveModel = $.noop;

        this.shipping_cost = 0;

        this.extra_info = new ExtraInfo(1);

        // models
        this.cart_model = new CartProductListModel(this.extra_info);

        // views
        this.product_view = new CartProductListView();
        this.total_view = new CartTotalView();
        this.total_extern_view = new ExternalCartTotalView();
        this.units_total_view = new UnitsTotalView();
        this.checkout_form_view = new CheckoutFormView();

        // google analytics
        this.is_ga_enabled = true;

        // add models and views
        this.addModel('product-list', this.cart_model);

        this.addView('product-list-view', this.product_view);
        this.addView('total-view', this.total_view);
        this.addView('total-extern-view', this.total_extern_view);
        this.addView('units-total-view', this.units_total_view);
        this.addView('checkout-form-view', this.checkout_form_view);

        // add view actions
        this.product_view.setClickAction('lp-cart-add');
        this.total_view.setClickAction('lp-cart-add-one');
        this.total_view.setClickAction('lp-cart-remove-one');
        this.total_view.setClickAction('lp-cart-remove');

        this.total_view.setEnterAction('lp-discount');

        this.cart_model.loadProducts();

    }

    onInit()
    {
        return true;
    }

    // Interface
    onModelLoaded(endpoint, data, method)
    {
        if (endpoint.indexOf('v1/cart') === 0 && method === 'get')
        {
            this.product_view.render();
            this.total_view.render();
            this.total_extern_view.render();
            this.units_total_view.render();
            this.checkout_form_view.render();

            this.onLoadCart(data.products);
        }
        if (endpoint.indexOf('v1/cart') === 0 && method === 'post')
        {
            this.onSaveModel();
        }
    }

    onModelUpdate(model)
    {
        this.product_view.render();
        this.total_view.render();
        this.total_extern_view.render();
        this.units_total_view.render();
        this.checkout_form_view.render();
    }

    onActionPerformed(tag_name, data, $element)
    {
        if (tag_name === 'lp-cart-add')
        {
            this.cart_model.addProduct(
                $element.attr('product-sku'),
                $element.attr('product-combination'),
                $element.attr('product-price'),
                $element.attr('product-name'),
                $element.attr('product-upp'),
                $element.attr('product-bullet1'),
                $element.attr('product-bullet2'),
                $element.attr('product-bullet3'),
                $element.attr('product-img'));
        }

        if (tag_name === "lp-cart-add-one")
        {
            this.cart_model.addOne(data);
        }

        if (tag_name === "lp-cart-remove-one")
        {
            this.cart_model.removeOne(data);
        }

        if (tag_name === "lp-cart-remove")
        {
            this.cart_model.removeProduct(data);
        }

        if (tag_name === "lp-discount")
        {
            this.cart_model.getDiscount(data, this.site_name);
        }
    }

    onViewRequestData(view)
    {
        if (view.id === this.product_view.id)
        {
            return this.getProducts();
        }
        if (view.id === this.total_view.id ||
            view.id === this.total_extern_view.id ||
            view.id === this.units_total_view.id ||
            view.id === this.checkout_form_view.id
        )
        {
            return {
                'subtotal': this.getSubTotal(),
                'total' : this.getTotal(),
                'shipping_cost': this.shipping_cost,
                'units_total' : this.getUnitsTotal(),
                'upp_total' : this.getUPPTotal(),
                'checkout_url' : this.getCheckoutUrl(),
                'site_id' : this.getSiteId(),
                'cart_id' : this.getGUID(),
                'discount_code' : this.getDiscountCode(),
                'percentage' : this.getPercentage()
            };
        }
    }

    set guid(guid){
        this.cart_model.guid = guid;
        this.cart_model.loadProducts();
    }
    get guid() { return this.cart_model.guid; }

    getGUID()
    {
        return this.cart_model.guid;
    }

    getCheckoutUrl()
    {
        return this.checkout_url;
    }

    getSiteId()
    {
        return this.site_id;
    }

    saveModel(callback)
    {
        this.onSaveModel = callback;
        this.cart_model.saveCart();
    }

    /**
     * return the currently selected combination
     * @return {string} current combination
     */
    getCurrentCombination ()
    {
        // implemented outside
        return "";
    }

    /**
     * add an element to the shopping cart
     * @param  {int}   id       product unique identifier
     * @param  {float}   price     product price
     * @param  {string}   name
     * @param  {int}   upp      units per product
     * @param  {string}   bullet1  some random text
     * @param  {string}   bullet2  some random text
     * @param  {string}   bullet3  some random text
     * @param  {object}   img      json with images
     * @param  {Function} callback callback this method when loaded
     * @todo: use promisses
     */
    addProduct(id, sku, combination, price, name, upp, bullet1, bullet2, bullet3, img, callback)
    {
        // soft replacement of id by sku
        if (sku === '')
        {
            sku = id;
        }

        this.cart_model.addProduct(
            sku, combination, price, name, upp,
            bullet1, bullet2, bullet3, img, callback
        );

        this.gaAddProduct({
            id, sku, combination, price, name, upp,
            bullet1, bullet2, bullet3, img
        }, this.cart_model.findProductIndex(id));
    }

    /**
     * remove element from shopping cart
     * @param  {int} id  product id
     */
    removeProduct(id)
    {
        this.cart_model.removeProduct(id);
    }

    /**
     * remove one product from the cart
     * @param  {int} id  product id
     */
    removeOne(sku, combination="")
    {
        var cp = this.cart_model.findProductBySKUCombination(sku, combination);
        this.cart_model.removeOne(cp.id);
    }

    /**
     * return a list of productos
     * @return {list}  a list which contains products
     */
    getProducts()
    {
        return this.cart_model.products;
    }

    /**
     * @deprecated moved to model
     * check if product exists
     * @param  {int} id product id
     * @param  {string}  sku also unique identifier (optional)
     * @return {boolean}    true if product exists, false otherwise
     */
    // productExist(id, sku)
    // {
    //     var pid = parseInt(id);
    //     var final_sku = sku === undefined ? '':sku;
    //     // get the product from model, if exist or create from database
    //     for (var i = 0; i < this.model.length; i++)
    //     {
    //         if (parseInt(this.model[i].id) === pid &&
    //             final_sku === this.model[i].sku )
    //         {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    getSubTotal()
    {
        var total = 0;

        total += this.cart_model.getProductTotal();

        return total;
    }

    getTotal()
    {
        var total = 0;
        var percentage = 0;

        total += this.cart_model.getProductTotal();
        total += this.shipping_cost;

        percentage = this.getPercentage();

        if (percentage > 0)
            total = total * (100 - percentage) / 100;

        return total;
    }

    getUnitsTotal()
    {
        return this.cart_model.getUnitsTotal();
    }

    /** upp == units per product */
    getUPPTotal()
    {
        return this.cart_model.getUPPTotal();
    }

    /**
     * @deprecated
     * load cart from a cookie
     * @param  {object} callback  callback executed when the cart is loaded
     */
    loadCart(callback=$.noop)
    {
        this.onLoadCart = callback;
    }

    setShippingCost(shipping_cost)
    {
        this.shipping_cost = shipping_cost;
        this.product_view.render();
        this.total_view.render();
        this.total_extern_view.render();
        this.units_total_view.render();
        this.checkout_form_view.render();
    }

    /**
     * set google analytics enhanced for ecommerce enabled
     * @param  {function} ga google analytics function
     */
    enableGA()
    {
        this.is_ga_enabled = true;

        window.ga( 'require', 'ec');
    }

    gaAddProduct(product, position)
    {
        try
        {
            if (this.is_ga_enabled)
            {
                this.gaSetProduct(product, position);

                window.ga( 'ec:setAction', 'add');
                window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
                // window.ga( 'ec:setAction', 'add');
                // window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
            }
        }
        catch(e)
        {
            // nothing here...
        }
    }

    gaRemoveProduct(product)
    {
        try
        {
            if (this.is_ga_enabled)
            {
                this.gaSetProduct(product, 0);

                window.ga( 'ec:setAction', 'remove');
                window.ga( 'send', 'event', 'UX', 'click', 'add to cart');
            }
        }
        catch(e)
        {
            // nothin here...
        }
    }

    gaSetProduct(product, position)
    {
        window.ga( 'ec:addProduct', {
          'id': product.id,
          'name': product.name,
          'price' : product.main_price,
          'position': position
        });
    }

    clearCart(callback)
    {
        this.model = [];
        this.cart_model.saveCart(callback);
        // this.saveModel(callback);
    }

    getDiscountCode()
    {
        return this.cart_model.getDiscountCode();
    }

    getPercentage()
    {
        return this.cart_model.getPercentage();
    }
}
