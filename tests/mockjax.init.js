/*global $*/

"use strict";
var shopping_carts = {};

$.mockjax({
    url: /^http:\/\/apibodegas.ondev.today\/authenticate\/([\d]+)$/,
    urlParams: ["app_id"],
    response: function()
    {
        this.responseText = {"message": "success", "success": true};
    }
});

$.mockjax({
    url: /^http:\/\/apibodegas.ondev.today\/cart\/load\/(.+)$/,
    urlParams: ["cart_id"],
    response: function(settings) 
    {
        var products = shopping_carts[settings.urlParams.cart_id] === undefined ? [] : shopping_carts[settings.urlParams.cart_id];
        this.responseText = {"checkout_url": "", "failure_url": "", "products": products, "webpay_url": "", "success_url": "", "total": 0, "cart_id": settings.urlParams.cart_id, "session_id": ""};
    }
});

$.mockjax({
    url: "http://apibodegas.ondev.today/product/list/2/1/10/false",
    responseText: {"products": [{"bulk_price": 1, "upp" : 2, "sku": "2212121", "description": "<ul><li>Alimento para gato Adulto, Delicias de carne y pescado Mayores 7 a\u00f1os<\/li><\/ul>", "site_id": 2, "brand": "CAT CHOW", "enabled": false, "name": "CAT CHOW Adultos  8 Kg", "image": null, "main_price": 13860, "cost_price": 13860, "id": 415, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "2212115", "description": "<ul><li>Alimento para gato Adulto Ahora t\u00fa tambi\u00e9n podr\u00e1s ver la diferencia que hace una buena nutrici\u00f3n. Ojos brillantes, pelaje reluciente, vitalidad. Es esto lo que queremos para nuestro gato y es as\u00ed que sabemos que tiene una buena alimentaci\u00f3n.<\/li><\/ul>", "site_id": 2, "brand": "CAT CHOW", "enabled": false, "name": "CAT CHOW Vida Sana  7 Kg", "image": null, "main_price": 13689, "cost_price": 13689, "id": 414, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "18804", "description": "<ul><li>Snack para perros, Integral Junior Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 300 Gr.", "image": null, "main_price": 1323, "cost_price": 1323, "id": 404, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "18802", "description": "<ul><li>Snack para perros, Integral Duo Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 500 Gr.", "image": null, "main_price": 1953, "cost_price": 1953, "id": 402, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "18803", "description": "<ul><li>Snack para perros, Integral Mini Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 500 Gr.", "image": null, "main_price": 1953, "cost_price": 1953, "id": 403, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "18801", "description": "<ul><li>Snack para perros, Integral Maxi Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 500 Gr.", "image": null, "main_price": 1953, "cost_price": 1953, "id": 401, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "17702", "description": "<ul><li>Snack para perros, Tartitas Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 600 Gr.", "image": null, "main_price": 8664, "cost_price": 8664, "id": 400, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 1, "sku": "17701", "description": "<ul><li>Snack para perros, Mix de fruta Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW ABRAZZOS 600 Gr.", "image": null, "main_price": 8664, "cost_price": 8664, "id": 399, "promotion_price": 1, "manufacturer": "Nestle"}, {"bulk_price": 0, "sku": "1124", "description": "<ul><li>Alimento para perro Adulto mayor, todas las razas mayores de 7 a\u00f1os PURINA\u00ae DOG CHOW\u00ae Adultos Mayores de 7 A\u00f1os\u00a0est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que ayudar\u00e1n a su cuerpo maduro tener salud y vitalidad por muchos a\u00f1os por venir<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW Ad Mayores de 7  A\u00f1os 1,5 Kg", "image": null, "main_price": 2779, "cost_price": 2779, "id": 346, "promotion_price": 0, "manufacturer": "Nestle"}, {"bulk_price": 0, "sku": "111", "description": "<ul><li>Alimento para perro Adulto sabor Pollo Purina Dog Chow Adultos est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que lo ayudar\u00e1n a tener salud y vitalidad por muchos m\u00e1s a\u00f1os.Purina Dog Chow Adultos est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que lo ayudar\u00e1n a tener salud y vitalidad por muchos m\u00e1s a\u00f1os.<\/li><\/ul>", "site_id": 2, "brand": "DOG CHOW", "enabled": false, "name": "DOG CHOW Ad Pollo 21 Kg", "image": null, "main_price": 30134, "cost_price": 30134, "id": 328, "promotion_price": 0, "manufacturer": "Nestle"}]}
});

$.mockjax({
    url: "http://apibodegas.ondev.today/product/list/2/1/10/dogs",
    responseText: {"error": {"message": "'success'", "code": 100, "type": ""}}
});

$.mockjax({
    url: /^http:\/\/apibodegas.ondev.today\/product\/get\/(.+)$/,
    urlParams: ["product_id"],
    response: function(settings)
    {
        this.responseText = {"bulk_price": 1, "upp" : 2, "sku": "2212121", "bullet_three": null, "description": "<ul><li>Alimento para gato Adulto, Delicias de carne y pescado Mayores 7 a\u00f1os<\/li><\/ul>", "bullet_one": null, "bullet_two": null, "brand": "CAT CHOW", "enabled": false, "name": "CAT CHOW Adultos  8 Kg", "site_id": 2, "main_price": 13860, "manufacturer": "Nestle", "id": settings.urlParams.product_id, "promotion_price": 1, "cost_price": 13860};
    },
});

$.mockjax({
    url: "http://apibodegas.ondev.today/product/images/*",
    responseText: {"count": 1, "images": [{"url": "https://static.loadingplay.com/static/images/75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_500": "https://static.loadingplay.com/static/images/500_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_1": "https://static.loadingplay.com/static/images/1_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_200": "https://static.loadingplay.com/static/images/200_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png"}]}
});

$.mockjax({
    url: /^http:\/\/apibodegas.ondev.today\/cart\/save\/(.+)$/,
    urlParams: ["cart_id"],
    response: function(settings)
    {
        shopping_carts[settings.urlParams.cart_id] = $.parseJSON(settings.data.json_data);
        this.responseText = {"message": "cart saved", "success": true};
    }
});

$.mockjax({
    url: /^http:\/\/apibodegas.ondev.today\/cart\/extra_info\/(.+)$/,
    urlParams: ["cart_id"],
    response: function(settings)
    {
        this.responseText = {"message": "extra info saved", "success": true};
    }
});