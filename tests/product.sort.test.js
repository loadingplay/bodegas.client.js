QUnit.test('product sort', function(assert) 
{
    var $env = $('<div></div>');
    var done = assert.async();

    $($env).ecommerce({'sortBy': 'main_price',
        onLoad: function(products)
        {
            assert.equal(0, 0, 'Nada');

            for (var i = 0; i < products.length-1; i++) 
            {
                assert.ok( ( products[i].main_price >= products[i+1].main_price ), 
                    'product sorted correctly');
            }

            done();
        }
    });
});

QUnit.test('product sort by url parameter main_price ascendant', function(assert)
{
    var $env = $('<div></div>');
    var done = assert.async();

    window.history.pushState('', '', '?sortBy=main_price&sortOrientation=asc');

    $($env).ecommerce({'sortBy' : $.urlParam('sortBy'), 'sortOrientation' : $.urlParam('sortOrientation'),
        onLoad: function (products)
        {

            assert.ok((products!=null),"loaded products");
            var result = true;

            for (var i = 0; i < products.length-1; i++) 
            {
                if (products[i].main_price > products[i+1].main_price) 
                {
                    result = false;
                    break;
                }
            }

            assert.ok(result, "products all sorted by main_price ascendant");
        }
    });
});


    //Recuperar valor de la url y validarlo con un assert

    // $($env).ecommerce({"sortBy" : sortBy, 
    //     onLoad: function (products){
    //         assert.equal(0, 0, 'Nada');

    //         for (var i = 0; i < products.length; i++) {
                
    //         }
    //     }
    // });

    //Agregar window.history.pushSTATE();
    //Agregar window.location.href += ?sortBy='algo' para agregar este valor a la URL

$.urlParam = function(name)
    {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        try
        {
            return results[1] || 0; //Si lo encuentra, devuelve el valor 
        }
        catch(err)
        {
            return; //Si no lo encuentra, devuelve undefined
        }
    }

// QUnit.test('product sort', function(assert) 
// {
//     var $env = $('<div></div>');
//     var done = assert.async();

//     $($env).ecommerce({
//         onLoad: function(products)
//         {
//             assert.equal(0, 0, 'nada');

//             $($env).ecommerce({'sortBy': 'main_price'}, function(products)
//             {
//                 var aux = products[0].main_price;
//                 for (var i = 1; i < products.length; i++) 
//                 {
//                     assert.ok((aux > products[i].main_price), 'all products are sorted');

//                     aux = products[i].main_price;
//                 }

//                 done();
//             });
//         }
//     });

// });
