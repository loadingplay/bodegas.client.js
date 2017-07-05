/*global $*/

var base_url = "(http|https)://*.*";
var shopping_carts = {};
var product_list = {
    "products": [{
        "bulk_price": 1,
        "upp": 2,
        "sku": "2212121",
        "description": "<ul><li>Alimento para gato Adulto, Delicias de carne y pescado Mayores 7 a\u00f1os<\/li><\/ul>",
        "site_id": 2,
        "brand": "CAT CHOW",
        "enabled": false,
        "name": "CAT CHOW Adultos  8 Kg",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 13860,
        "cost_price": 13860,
        "id": 415,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "2212115",
        "description": "<ul><li>Alimento para gato Adulto Ahora t\u00fa tambi\u00e9n podr\u00e1s ver la diferencia que hace una buena nutrici\u00f3n. Ojos brillantes, pelaje reluciente, vitalidad. Es esto lo que queremos para nuestro gato y es as\u00ed que sabemos que tiene una buena alimentaci\u00f3n.<\/li><\/ul>",
        "site_id": 2,
        "brand": "CAT CHOW",
        "enabled": false,
        "name": "CAT CHOW Vida Sana  7 Kg",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 13689,
        "cost_price": 13689,
        "id": 414,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "18804",
        "description": "<ul><li>Snack para perros, Integral Junior Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 300 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 1323,
        "cost_price": 1323,
        "id": 404,
        "promotion_price": 1,
        "manufacturer": "Nestle",
        "upp": 2
    }, {
        "bulk_price": 1,
        "sku": "18802",
        "description": "<ul><li>Snack para perros, Integral Duo Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 500 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 1953,
        "cost_price": 1953,
        "id": 402,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "18803",
        "description": "<ul><li>Snack para perros, Integral Mini Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 500 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 1953,
        "cost_price": 1953,
        "id": 403,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "18801",
        "description": "<ul><li>Snack para perros, Integral Maxi Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 500 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 1953,
        "cost_price": 1953,
        "id": 401,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "17702",
        "description": "<ul><li>Snack para perros, Tartitas Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 600 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 8664,
        "cost_price": 8664,
        "id": 400,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 1,
        "sku": "17701",
        "description": "<ul><li>Snack para perros, Mix de fruta Es una l\u00ednea de riqu\u00edsimas galletitas horneadas con cuidado especial y preparadas con ingredientes integrales y deliciosos sabores naturales.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW ABRAZZOS 600 Gr.",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 8664,
        "cost_price": 8664,
        "id": 399,
        "promotion_price": 1,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 0,
        "sku": "1124",
        "description": "<ul><li>Alimento para perro Adulto mayor, todas las razas mayores de 7 a\u00f1os PURINA\u00ae DOG CHOW\u00ae Adultos Mayores de 7 A\u00f1os\u00a0est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que ayudar\u00e1n a su cuerpo maduro tener salud y vitalidad por muchos a\u00f1os por venir<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW Ad Mayores de 7  A\u00f1os 1,5 Kg",
        "images": [
            [
                "https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png",
                "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"
            ]
        ],
        "main_price": 2779,
        "cost_price": 2779,
        "id": 346,
        "promotion_price": 0,
        "manufacturer": "Nestle"
    }, {
        "bulk_price": 0,
        "sku": "111",
        "description": "<ul><li>Alimento para perro Adulto sabor Pollo Purina Dog Chow Adultos est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que lo ayudar\u00e1n a tener salud y vitalidad por muchos m\u00e1s a\u00f1os.Purina Dog Chow Adultos est\u00e1 espec\u00edficamente formulado con los nutrientes e ingredientes de calidad que lo ayudar\u00e1n a tener salud y vitalidad por muchos m\u00e1s a\u00f1os.<\/li><\/ul>",
        "site_id": 2,
        "brand": "DOG CHOW",
        "enabled": false,
        "name": "DOG CHOW Ad Pollo 21 Kg",
        "images": [
            ["https://7static.loadingplay.com/static/images/1_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png", "https://7static.loadingplay.com/static/images/200_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png", "https://84static.loadingplay.com/static/images/500_4799bd4dd9fdc1599355e6743ed9580c_PESCADO2.png.png"]
        ],
        "main_price": 30134,
        "cost_price": 30134,
        "id": 328,
        "upp": 2,
        "promotion_price": 0,
        "manufacturer": "Nestle"
    }]
};

$.mockjax({
    url: new RegExp(base_url + '/product/images/(.+)'),
    urlParams: ["protocol", "product_id"],
    response: function()
    {
        this.responseText = {"count": 1, "images": [{"url": "https://7static.loadingplay.com/static/images/cdb166af8c72147316fc55ed65063c3d_(12.5)_Adulto_Pollo_y_Arroz.png.png", "thumb_500": "https://7static.loadingplay.com/static/images/500_cdb166af8c72147316fc55ed65063c3d_(12.5)_Adulto_Pollo_y_Arroz.png.png", "thumb_1": "https://7static.loadingplay.com/static/images/1_cdb166af8c72147316fc55ed65063c3d_(12.5)_Adulto_Pollo_y_Arroz.png.png", "thumb_200": "https://7static.loadingplay.com/static/images/200_cdb166af8c72147316fc55ed65063c3d_(12.5)_Adulto_Pollo_y_Arroz.png.png"}]};
    }
});

$.mockjax({
    url: new RegExp(base_url + "/authenticate/(.+)"),
    urlParams: ["protocol", "app_id"],
    response: function()
    {
        this.responseText = {"message": "success", "success": true};
    }
});

$.mockjax({
    url: new RegExp(base_url + "/cart/load/(.+)"),
    urlParams: ["protocol", "cart_id"],
    response: function(settings) 
    {
        var products = shopping_carts[settings.urlParams.cart_id] === undefined ? [] : shopping_carts[settings.urlParams.cart_id];
        var expired = (settings.urlParams.cart_id === "foo");

        this.responseText = {
            "checkout_url": "", 
            "expired" : expired, 
            "failure_url": "", 
            "products": products, 
            "webpay_url": "", 
            "success_url": "", 
            "total": 0, 
            "cart_id": expired ? 'asd' : settings.urlParams.cart_id, 
            "session_id": ""
        };
    }
});

$.mockjax({
    url: new RegExp(base_url + "/product/list/2/1/10/false/true"),
    responseText: product_list
});

$.mockjax({
    url: new RegExp(base_url + "/product/list/2/1/10/false/false"),
    responseText: product_list
});

$.mockjax({
    url: new RegExp(base_url + "/product/list/2/1/10/false/false"),
    responseText: product_list
});

$.mockjax({
    url: new RegExp(base_url + "/product/list/1/1/5/false/false"),
    responseText: product_list
});

$.mockjax({
    url: new RegExp(base_url + "/product/list/2/1/10/dogs"),
    responseText: {"error": {"message": "'success'", "code": 100, "type": ""}}
});


// $.mockjax({
//     url: new RegExp(base_url + '/product/get/(.+)'),
//     urlParams: ["protocol", "product_id"],
//     response: function()
//     {
//         this.responseText = {"bulk_price": 1, "stores": [], "bullet_3": "foo", "bullet_2": "3k", "site_id": 2, "bullet_1": "Alimento para gato adulto, delicias de carne 1 a 7 a\u00c3\u00b1os", "id": 1127, "sku": "2212107", "weight": null, "profit_margin": null, "main_price": 6494, "cost_price": 6494, "description": "PURINA CAT CHOW Adultos te ofrece un alimento 100% completo y balanceado desarrollado especialmente para los gatos de 1-7 a\u00c3\u00b1os de edad que le podr\u00c3\u00a1 ayudar a mantener un desarrollo sano de su coraz\u00f3n y un sistema inmunol\u00f3gico m\u00c3\u00a1s fuerte gracias a su contenido de: Prote\u00c3\u00adnas, Amino\u00c3\u00a1cidos esenciale, Grasas, Minerales y Vitaminas, Antioxidantes.<br><br>Formato de Venta: Bolsa<br><br>Delivery: 72 horas<br>", "tags": [1], "brand": "CAT CHOW", "manufacturer": "Nestle", "name": "Cat Chow Adultos", "enabled": false, "for_sale": true, "promotion_price": 0, "position": 0, "upp": 1}
//     }
// });

$.mockjax({
    url: new RegExp(base_url + "/product/get/(.+)"),
    urlParams: ["protocol", "product_id"],
    response: function(settings)
    {
        if (settings.urlParams.product_id === "1127")
        {
            this.responseText = {
                "bulk_price": 1, 
                "stores": [], 
                "bullet_3": "foo", 
                "bullet_2": "3k", 
                "site_id": 2, 
                "bullet_1": "Alimento para gato adulto, delicias de carne 1 a 7 a\u00c3\u00b1os", 
                "id": 1127, 
                "sku": "2212107", 
                "weight": null, 
                "profit_margin": null, 
                "main_price": 6494, 
                "cost_price": 6494, 
                "description": "PURINA CAT CHOW Adultos te ofrece un alimento 100% completo y balanceado desarrollado especialmente para los gatos de 1-7 a\u00c3\u00b1os de edad que le podr\u00c3\u00a1 ayudar a mantener un desarrollo sano de su coraz\u00f3n y un sistema inmunol\u00f3gico m\u00c3\u00a1s fuerte gracias a su contenido de: Prote\u00c3\u00adnas, Amino\u00c3\u00a1cidos esenciale, Grasas, Minerales y Vitaminas, Antioxidantes.<br><br>Formato de Venta: Bolsa<br><br>Delivery: 72 horas<br>", 
                "tags": [1], 
                "brand": "CAT CHOW", 
                "manufacturer": "Nestle", 
                "name": "Cat Chow Adultos", 
                "enabled": false, 
                "for_sale": true, 
                "promotion_price": 0, 
                "position": 0, 
                "upp": 1
            }
        }
        else
        {
            this.responseText = {
                "bulk_price": 1, 
                "upp" : 2, 
                "sku": "2212121", 
                "bullet_three": null, 
                "description": "<ul><li>Snack para perros, Integral Junior Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.Producto semi-h\u00famedo para premiar o complementar la alimentaci\u00f3n de su perro.<\/li><li>Formulados con ingredientes altamente palatables y exquisito aroma que los hace irresistibles para su perro.<\/li><\/ul>", 
                "bullet_one": null, 
                "bullet_two": null, 
                "brand": "CAT CHOW", 
                "enabled": false, 
                "name": "CAT CHOW Adultos  8 Kg", 
                "site_id": 2, 
                "main_price": 13860, 
                "manufacturer": "Nestle", 
                "id": settings.urlParams.product_id, 
                "promotion_price": 1, 
                "cost_price": 13860,
                "upp": 2
            };
        }
    },
});

$.mockjax({
    url : new RegExp(base_url + "/product/get/"),
    response: function()
    {
        this.responseText = {"bulk_price": 1, "stores": [], "bullet_3": "foo", "bullet_2": "3k", "site_id": 2, "bullet_1": "Alimento para gato adulto, delicias de carne 1 a 7 a\u00c3\u00b1os", "id": 1127, "sku": "2212107", "weight": null, "profit_margin": null, "main_price": 6494, "cost_price": 6494, "description": "PURINA CAT CHOW Adultos te ofrece un alimento 100% completo y balanceado desarrollado especialmente para los gatos de 1-7 a\u00c3\u00b1os de edad que le podr\u00c3\u00a1 ayudar a mantener un desarrollo sano de su coraz\u00f3n y un sistema inmunol\u00f3gico m\u00c3\u00a1s fuerte gracias a su contenido de: Prote\u00c3\u00adnas, Amino\u00c3\u00a1cidos esenciale, Grasas, Minerales y Vitaminas, Antioxidantes.<br><br>Formato de Venta: Bolsa<br><br>Delivery: 72 horas<br>", "tags": [1], "brand": "CAT CHOW", "manufacturer": "Nestle", "name": "Cat Chow Adultos", "enabled": false, "for_sale": true, "promotion_price": 0, "position": 0, "upp": 1}
    }
});

$.mockjax({
    url: new RegExp(base_url + "/product/images/*"),
    responseText: {"count": 1, "images": [{"url": "https://static.loadingplay.com/static/images/75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_500": "https://static.loadingplay.com/static/images/500_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_1": "https://static.loadingplay.com/static/images/1_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png", "thumb_200": "https://static.loadingplay.com/static/images/200_75b152c9fa4aca8cc00a882b7e134115_CARNE2.png.png"}]}
});

$.mockjax({
    url: new RegExp(base_url + "/cart/save/(.+)"),
    urlParams: ["protocol", "cart_id"],
    response: function(settings)
    {
        shopping_carts[settings.urlParams.cart_id] = $.parseJSON(settings.data.json_data);
        this.responseText = {"message": "cart saved", "success": true};
    }
});

$.mockjax({
    url: new RegExp(base_url + "/cart/extra_info/(.+)"),
    urlParams: ["protocol", "cart_id"],
    response: function(settings)
    {
        this.responseText = {"message": "extra info saved", "success": true};
    }
});

$.mockjax({
    url: new RegExp(base_url + "/product/search"),
    type: "post",
    response: function(settings)
    {
        // console.log(product_list);
        this.responseText = product_list
        settings.data.direction = settings.data.direction === undefined ? 'asc':settings.data.direction;
        var m = settings.data.direction === "asc" ? 1 : -1;
        this.responseText.products.sort(function(a, b)
        {
            if (a.main_price > b.main_price)
            {
                return 1 * m
            }
            else if (a.main_price < b.main_price)
            {
                return -1 * m
            }
            else
            {
                return 0
            }
        });
    }
});


$.mockjax({
    url: new RegExp(base_url + "/tag/list_all/*"),
    type: "get",
    responseText: {"tags": [{"visible": 1, "site_id": 2, "id": 19, "name": "gato"}, {"visible": 1, "site_id": 2, "id": 2, "name": "perro"}]}
});


$.mockjax({
    url: new RegExp(base_url + "/variant/list"),
    type: "get",
    response: function(settings)
    {
        this.responseText = {"status": "success", "variants": [{"id": 1, "name": "talla"}, {"id": 2, "name": "color"}]};
    }
});


$.mockjax({
    url: new RegExp(base_url + "/variant/value/list"),
    type: "get",
    response: function(settings)
    {
        this.responseText = {
            "status": "success", 
            "values": [{
                "values": [{
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 1, 
                    "value": "1", 
                    "variant_name": "talla"
                }, {
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 2, 
                    "value": "2", 
                    "variant_name": "talla"
                }, {
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 3, 
                    "value": "3", 
                    "variant_name": "talla"
                }], 
                "variant_name": "talla"
            }, {
                "values": [{
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 4, 
                    "value": "rojo", 
                    "variant_name": "color"
                }, {
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 5, 
                    "value": "verde", 
                    "variant_name": "color"
                }, {
                    "site_name": "me_NBK-SACO-NEGRA-C168", 
                    "id": 6, 
                    "value": "azul", 
                    "variant_name": "color"
                }], 
                "variant_name": "color"
            }]
        };
    }
});
