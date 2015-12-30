/*global ShoppingCart*/
/*global $*/
/*global Utils*/

'use strict';

var ShoppingCartView = function(controller)
{
    this.controller = controller === undefined ? new ShoppingCart() : controller;
    this.options = {
        cartSelector : '.shopping-cart',
        addToCartbutton : '.add-to-cart',
        buyProductButton : '.buy-product',
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one'
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

    $(document).on('click', this.options.addToCartbutton, function(evt)
    {
        evt.preventDefault();

        if (!$(this).hasClass('product-sold-out'))
        {
            self.addToCartClick($(this));
            self.render();
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

    $(document).on('click', this.options.removeFromCart, function(evt)
    {
        evt.preventDefault();
        self.removeProduct($(this));
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

ShoppingCartView.prototype.addToCartClick = function($button) 
{
    var id = $button.attr('product-id');
    var name = $button.attr('product-name');
    var price = $button.attr('product-price');
    var upp = $button.attr('product-upp');
    var bullet1 = $button.attr('product-bullet1');
    var bullet2 = $button.attr('product-bullet2');
    var bullet3 = $button.attr('product-bullet3');

    this.controller.addProduct(id, price, name, upp, bullet1, bullet2, bullet3);
};

ShoppingCartView.prototype.buyProductClick = function($button) 
{
    var self = this;

    // get product data
    var product = {
        id : $button.attr('product-id'),
        name : $button.attr('product-name'),
        price : $button.attr('product-price'),
        upp : $button.attr('product-upp'),
        bullet1 : $button.attr('product-bullet1'),
        bullet2 : $button.attr('product-bullet2'),
        bullet3 : $button.attr('product-bullet3')
    };

    // get checkout data
    var checkout = {
        checkout_url : this.controller.getCheckoutUrl(),
        site_id : this.controller.getSiteId(),
        cart_id : this.controller.getGUID()
    };

    // delete all other products
    this.controller.clearCart(function(){

        // add the current product
        self.controller.addProduct(
            product.id, 
            product.price, 
            product.name, 
            product.upp, 
            product.bullet1, 
            product.bullet2, 
            product.bullet3);

        // proceed to checkout
        self.goToCheckout(checkout);
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

ShoppingCartView.prototype.renderCheckoutData = function($cart_div)
{
    // var guid = this.controller.getGUID();
    // var checkout_url = this.controller.getCheckoutUrl();

    //console.log("site id" + this.controller.getSiteId());

    try
    {
        var html = Utils.render(
            this.checkout_template, 
            {
                'site_id' : this.controller.getSiteId(),
                'checkout_url': this.controller.getCheckoutUrl(),
                'cart_id': this.controller.getGUID()
            });

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
        var $total = $(Utils.render(
            this.total_template, 
            { 
                'total' : this.controller.getTotal(),
                'shipping_cost': this.controller.shipping_cost
            }));

        Utils.processPrice($total);
        $cart_div.append($total);

        var $built = $(Utils.render(
            this.total_cart_template, 
            { 
                'total' : this.controller.getTotal()
            }));

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
            { 
                'units_total' : this.controller.getUnitsTotal(),
                'upp_total' : this.controller.getUPPTotal()
            }));

        Utils.processPrice($units_total);
        // $cart_div.append($units_total);
        $('.units-total').html($units_total);

        var $built = $(Utils.render(
            this.total_items_template, 
            { 
                'total' : this.controller.getUnitsTotal()
            }));

        $total_items.html($built);
    }
    catch(ex)
    {
        // nothing here ...
    }
};
