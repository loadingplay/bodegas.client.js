/*jshint esversion: 6 */
/*global ShoppingCart*/
/*global document*/
/*global $*/
/*global Utils*/


class CartProductListView extends View
{
    constructor()
    {
        super($('.shopping-cart'));
        this.setTemplate($('#shopping-cart-product').html());
    }
}

class CartTotalView extends View
{
    constructor()
    {
        super($('.shopping-cart'));
        this.setTemplate($('#shopping-cart-total').html());
        this.append = true;
    }

}

class ExternalCartTotalView extends View
{
    constructor()
    {
        super($('.total_cart'));
        this.setTemplate($('#total_cart_template').html());
    }
}


class UnitsTotalView extends View
{
    constructor()
    {
        super($('.units-total'));
        this.setTemplate($('#shopping-cart-units-total').html());
    }
}

class CheckoutFormView extends View
{
    constructor()
    {
        super($('.checkout-form'));
        this.setTemplate($('#shopping-cart-checkout-form').html());
    }
}
