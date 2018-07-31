# bodegas.cliente.js [![Build Status](https://travis-ci.org/loadingplay/bodegas.client.js.svg?branch=master)](https://travis-ci.org/loadingplay/bodegas.client.js)

# Coverage

[![Coverage](http://ondev.today:8080/job/bodegas.client.js/6/cobertura/graph)](http://jenkins.ondev.today/job/bodegas.client.js/HTML_Cobertrura_Report/)

this a javascript client for bodegas


# getting started

1.- install all mpm dependences

```sh
$ npm install
```

2.- install all bower dependences

```sh
$ bower install
```

3.- run grunt default task

```sh
$ grunt
```

4.- now you can open sample in browser:

[http://localhost:9000/sample/index.html!](http://localhost:9000/sample/index.html)

or unittest:

[http://localhost:9000/tests/index.html!](http://localhost:9000/tests/index.html?coverage)


# Product List

```javascript
// you can send json data to show the list of the products

$(document).ready(function()
{
    var base_url = $.environmentVar(
        'https://apibodegas.loadingplay.com/',
        'https://apibodegas.loadingplay.com/',
        'https://apibodegas.loadingplay.com/');
    var checkout_url = $.environmentVar(
        'https://checkout.loadingplay.com',
        'https://checkout.loadingplay.com',
        'https://checkout.loadingplay.com');
    var app_public = $.environmentVar(#,#,#);

    var config = {
        'app_public': app_public,
        'base_url': base_url,
        'products_per_page' : 5,
        'tag': tag,
        'ignore_stock': false,
        'infinite_scroll': true,
        'checkout_url': checkout_url,
        'operator' :'or',
        'templateOrigin': '#product_template',
        'onLoad': function(products)
        {

        }
    };

    $(document).ecommerce(config);
});
```

## Parameters

```
Parameter | Description
--------- | -----------
base_url | Is the base enviroment for the cellar, it needs to be specified three times, the first one for localhost, the second for development and the last one for production
checkout_url | Same as the base_url but this identified the checkout url of the ecommerce
app_public | Also like the base_url and the checkout_url, this especified the id of the cellar that points the ecommerce (it has to be a number)
```

### Config Parameters

```
Parameter | Description
--------- | -----------
app_public | Calls the app_public that is already configuried
base_url | Calls the base_url that is already configuried
products_per_page | Shows the products per page on the product list
tag | You can filter by tags, changing this parameter with a String
ignore_stock | If is true, it shows the products even if the product does not have stock. If it is false, it doesn`t show the products
infinite_scroll | If is true, the product list is going to show all the products in one page
checkout_url | Calls the checkout_url that ir already configuried
operator | It can be 'and' / 'or'. If you had more than one tag, this will send the products that had the two tags (AND) or one or the other tag (OR)
templateOrigin | You can configure a template to the product to show in the list
onLoad | You can make functions that works when the products are loading to the page
```

# Product Detail

```javascript
// you can send json data to show the product detail

$(document).ready(function()
{
    var base_url = $.environmentVar(
        'https://apibodegas.loadingplay.com/',
        'https://apibodegas.loadingplay.com/',
        'https://apibodegas.loadingplay.com/');
    var checkout_url = $.environmentVar(
        'https://checkout.loadingplay.com',
        'https://checkout.loadingplay.com',
        'https://checkout.loadingplay.com');
    var app_public = $.environmentVar(#,#,#);

    $(document).ecommerce('product_detail',
    {
        'app_public' : app_public,
        'base_url' : base_url,
        'checkout_url': checkout_url,
        'product_id' : {{ product_id }},
        'container' : '.product-detail',
        onLoad: function(product)
        {
            related(product.tags[0]);
        }

    })

    var related = function(tag)
    {

        var config = {
            'app_public' : app_public,
            'base_url' : base_url,
            'maxProducts' : 10,
            'templateOrigin' : '#product_template',
            'tag' : tag,
            'ignore_stock' : true,
            'onLoad':function()
            {

            }
        };

        $('.product-related').ecommerce('product_box', config);

    };
});
```

## Parameters

```
Parameter | Description
--------- | -----------
base_url | Is the base enviroment for the cellar, it needs to be specified three times, the first one for localhost, the second for development and the last one for production
checkout_url | Same as the base_url but this identified the checkout url of the ecommerce
app_public | Also like the base_url and the checkout_url, this especified the id of the cellar that points the ecommerce (it has to be a number)
```

### Config Parameters

```
Parameter | Description
--------- | -----------
app_public | Calls the app_public that is already configuried
base_url | Calls the base_url that is already configuried
checkout_url | Calls the checkout_url that ir already configuried
container | You can configure a template to contain the detail of the product
onLoad | You can make functions that works when the product is loading to the page
```

### Related Parameters

```
Parameter | Description
--------- | -----------
app_public | Calls the app_public that is already configuried
base_url | Calls the base_url that is already configuried
maxProducts | It shows the products that are related with the product's tag
templateOrigin | You can configure a template to the product to show in the list
tag | You can filter by tags, changing this parameter with a String
ignore_stock | If is true, it shows the products even if the product does not have stock. If it is false, it doesn`t show the products
infinite_scroll | If is true, the product list is going t
onLoad | You can make functions that works when the product is loading to the page
```

# Ad to cart

```Javascript
// you can send attibuttes to the cart

<button
    type="button"
    class="add-to-cart"
    id="open-cart"
    product-upp="{{! upp }}"
    product-name="{{! name }}"
    product-price="{{! main_price }}"
    product-sku="{{! sku }}"
    product-id="{{! id }}"
    product-img="{{! images[1]['thumb_500'] }}"
    lp-cart-add
    disabled >
</button>
```

## Parameters

```
Parameter | Description
--------- | -----------
add-to-cart | This class allows any element to put products to the cart
product-upp |
product-name | Name of the product
product-price | Product price
product-sku | sku of the product
product-id | id of the product
product-img | image of the product

You can also put any of the elements of the product to fill the cart
```

#Shopping Cart

```
// you can send json data to show the shopping cart

//Base template for the cart

<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Cant</th>
        </tr>
    </thead>
    <tbody class="shopping-cart">
    </tbody>
</table>

//Script to show the products

<script type="text/x-template" id="shopping-cart-product">
    <tr>
        <td>{{! name }}</td>
        <td>{{! price }}</td>
        <td>
            <a class="remove-one" product-id="{{! id }}">-</a>
            {{! quantity }}
            <a class="add-one" product-id="{{! id }}">+</a>
        </td>
        <td>
            <a class="borrarproducto" cart-id="{{! id }}">
                <i class="icon-close"></i>
            </a>
        </td>
    </tr>
</script>
<script type="text/x-template" id="shopping-cart-total">
        <tr>
            <td>Total:</td>
            <td >{{! total|money }}</td>
            <td></td>
        </tr>
</script>
<script type="text/x-template" id="shopping-cart-units-total" >
    <span> {{! units_total }}</span>
</script>
<script type="text/x-template" id="shopping-cart-checkout-form" >
    <form action="{{! checkout_url}}" method="get" novalidate id="shipping-form" onclick="return Validate()">
        <input name="site_name" class="form-control required" type="hidden" value="{{! site_name}}">
        <input name="cart_id" class="form-control required" type="hidden" value="{{! cart_id}}">
        <input name="origin" class="form-control required" type="hidden" value="{{ site.name }}">
        <div class="form-group text-center">
             <button type="submit" class="btn bn">PAGAR</button>
        </div>
    </form>
</script>
```
##Parameters

```
Parameter | Description
--------- | -----------
shopping-cart | This class show the scripts of the shopping cart wherever the class is declared
```

###Script Parameters

```
Parameter | Description
--------- | -----------
{{! name }} | it shows the name of the product
{{! price }} | it shows the price of the product
remove-one | this class allows remove one of the quantity of the product, this class needs to be next to the product-id to specify the product
product-id | this attribute shows the id of the product
{{! id }} | it shows the product id
add-one | add one of the quantity of the product, this class needs to be next to the product-id to specify the product
borrarproducto | this class alows to remove the product from the cart, it needs to be next to the cart-id
cart-id | it shows the product id
{{! total|money }} | it shows the total of the shopping cart in money format
{{! units_total }} | it shows the total of the products that you are going to buy
{{! checkout_url}} | it shows the chackout url that is going to open when the subbmit button if its pressed
site_name | it shows the name of the site, the value is already configured
cart_id | this is the id of the cart that automaticlly appears on the checkout
origin | it shows the origin of the cart, it is the name of the site
```
