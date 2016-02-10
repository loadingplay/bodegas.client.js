# bodegas.cliente.js [![Build Status](http://jenkins.ondev.today/buildStatus/icon?job=bodegas.client.js)](http://ondev.today:8080/job/bodegas.client.js/)

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


# Extra Data

```javascript
// you can send json data
$(document).ecommerce('set_data', { 'foo' : 'bar' }); 

// or string
$(document).ecommerce('set_data', 'un string');
```

## Parameters

```json
{
    /********* COMMON **********/
    'app_public'            : 0,
    'base_url'              : 'http://localhost:8520/',
    /********* PRODUCTBOX **********/
    'tag' : '',
    'maxProducts' : 2,
    'templateOrigin' : '.product_template',
    'onLoad' : $.noop,
    /********* OTHER **********/
    'checkout_url'          : 'http://localhost:8522',
    'products_per_page'     : 12,
    'animation'             : 'none',  // none|basic
    'ignore_stock'          : false,   // if true, shows all products
    'product_id'            : null,
    'infinite_scroll'       : true,
    'analytics'             : ''  // analytics code
}
```
