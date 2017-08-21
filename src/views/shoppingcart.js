/*global ShoppingCart*/
/*global document*/
/*global $*/
/*global Utils*/

var ShoppingCartView = function(controller)
{
    this.controller = controller === undefined ? new ShoppingCart() : controller;
    this.options = {
        cartSelector : '.shopping-cart',
        addToCartbutton : '.add-to-cart',
        buyProductButton : '.buy-product',
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one',
        quantityUnits : '.quantity_units'
    };

    this.$cart_div = $('.shopping-cart');
    this.$cart_container = $('.cart-container');
    this.$total_items = $('.total_items');
    this.$total_cart = $('.total_cart');
    this.cart_item_template = $('#shopping-cart-product').html();
    this.total_template = $('#shopping-cart-total').html();
    this.checkout_template = $('#shopping-cart-checkout-form').html();
    this.units_total_template = $('#shopping-cart-units-total').html();
    this.total_items_template = $('#total_items_template').html();
    this.total_cart_template = $('#total_cart_template').html();

    this.renderLoading();

    this.init();
};

ShoppingCartView.prototype.init = function()
{
    var self = this;
    var q=1;

    $(document).on('click', this.options.addToCartbutton, function(evt)
    {
        evt.preventDefault();
        if (!$(this).hasClass('product-sold-out'))
        {
            for (var i = 0; i < parseInt(q); i++) {
                self.addToCartClick($(this));
            }
            // self.controller.loadCart();
            self.render();
            q=1;
        }
    });

    $(document).on('click', this.options.buyProductButton, function(evt)
    {
        evt.preventDefault();
        self.buyProductClick($(this));
    });

    $(document).on('click', this.options.addOne, function(evt)
    {
        evt.preventDefault();
        self.addOneClick($(this));
        self.render();
    });

    $(document).on('click', this.options.removeOne, function(evt)
    {
        evt.preventDefault();
        self.removeOne($(this));
        self.render();
    });

    $(document).on('change', this.options.quantityUnits, function(evt)
    {
        evt.preventDefault();
        q =  $(this).context.value;
        // self.removeOne($(this));
        // self.render();
    });

    $(document).on('click', this.options.removeFromCart, function(evt)
    {
        evt.preventDefault();
        self.removeProduct($(this)); //debe enviar id de producto
        self.render();
    });

    this.render();
};


ShoppingCartView.prototype.removeLoading = function()
{
    var $container = $('.container');
    $('.spinner', $container).remove();
};

ShoppingCartView.prototype.renderLoading = function()
{
    this.removeLoading();
    if (!this.allcontainerLoaded)
    {
        var $container = $('.container');
        $container.append($('#product_loading').html());
    }
};




/**************** button actions ****************/


ShoppingCartView.prototype.addOneClick = function($button)
{
    var id = $button.attr('product-id');
    this.controller.addProduct(id);
};

/**
 * get product data from button
 * @param {object}  $button     jquery button with data
 * @return {object} retur a list with all prouct elements
 */
ShoppingCartView.prototype.getProductData = function ($button)
{
    return [
        $button.attr('product-id'),
        $button.attr('product-sku'),
        $button.attr('product-price'),
        $button.attr('product-name'),
        $button.attr('product-upp'),
        $button.attr('product-bullet1'),
        $button.attr('product-bullet2'),
        $button.attr('product-bullet3'),
        $button.attr('product-img')
    ];
};

ShoppingCartView.prototype.addToCartClick = function($button)
{
    this.controller.addProduct.apply(
        this.controller, this.getProductData($button));
};


/**
 * collect and return checkout data
 * @return {object} checkout data bundle
 */
ShoppingCartView.prototype.getCheckoutData = function()
{
    return {
        checkout_url : this.controller.getCheckoutUrl(),
        site_id : this.controller.getSiteId(),
        cart_id : this.controller.getGUID()
    };
};

ShoppingCartView.prototype.buyProductClick = function($button)
{
    var self = this;

    // get checkout data
    var checkout = self.getCheckoutData();

    // delete all other products
    this.controller.clearCart(function(){

        // add the current product
        self.controller.addProduct.apply(
            self.controller,
            self.getProductData($button).push(function()
                {
                    // proceed to checkout
                    self.goToCheckout(checkout);
                })
            );
    });
};

ShoppingCartView.prototype.goToCheckout = function(checkout)
{
    document.location.href = checkout.checkout_url + '?' +
                            'site_id=' + checkout.site_id +
                            '&cart_id=' + checkout.cart_id;
};

ShoppingCartView.prototype.removeOne = function($button)
{
    var id = $button.attr('product-id');

    this.controller.removeOne(id);
};

ShoppingCartView.prototype.removeProduct = function($button)
{
    var id = $button.attr('product-id');

    this.controller.removeProduct(id);
};


/**************** rendering methos ****************/


ShoppingCartView.prototype.render = function()
{
    this.$cart_div.html('');
    this.$total_cart.html('');
    this.renderProducts(this.$cart_div, this.cart_item_template);
    this.renderTotal(this.$cart_div, this.$total_cart);
    this.renderUnitsTotal(this.$cart_div, this.$total_items);
    this.renderCheckoutData(this.$cart_div);
};

ShoppingCartView.prototype.renderCheckoutData = function()
{
    try
    {
        var html = Utils.render(
            this.checkout_template,
            this.getRenderDictionary());

        $('.checkout-form').html(html);
    }
    catch(ex)
    {
        // nothing here...
    }
};

ShoppingCartView.prototype.renderProducts = function($cart_div, cart_item_template)
{
    var productos = this.controller.getProducts();

    for (var i = 0; i < productos.length; i++)
    {
        var $builder = $(Utils.render(cart_item_template, productos[i]));
        this.removeLoading();
        $cart_div.append($builder);
        Utils.processPrice($builder);
    }
};

ShoppingCartView.prototype.renderTotal = function($cart_div, $total_cart)
{
    try
    {
        var render_dict = this.getRenderDictionary();
        var $total = $(Utils.render(
            this.total_template,
            render_dict));

        Utils.processPrice($total);
        $cart_div.append($total);

        var $built = $(Utils.render(
            this.total_cart_template,
            render_dict));

        Utils.processPrice($built);
        $total_cart.html($built);

    }
    catch(ex)
    {
        // nothing here...
    }
};

ShoppingCartView.prototype.renderUnitsTotal = function($cart_div, $total_items)
{
    try
    {
        var $units_total = $(Utils.render(
            this.units_total_template,
            this.getRenderDictionary()));

        Utils.processPrice($units_total);
        // $cart_div.append($units_total);
        $('.units-total').html($units_total);

        var $built = $(Utils.render(
            this.total_items_template,
            this.getRenderDictionary()));

        $total_items.html($built);
    }
    catch(ex)
    {
        // nothing here ...
    }
};

/**
 * return all variables tht should be rendered in a shopping cart
 * @return Dict dictionary with all variables
 */
ShoppingCartView.prototype.getRenderDictionary = function()
{
    return {
        'total' : this.controller.getTotal(),
        'shipping_cost': this.controller.shipping_cost,
        'units_total' : this.controller.getUnitsTotal(),
        'upp_total' : this.controller.getUPPTotal(),
        'checkout_url' : this.controller.getCheckoutUrl(),
        'site_id' : this.controller.getSiteId(),
        'cart_id' : this.controller.getGUID()
    };
};
