QUnit.test('product sort get url parameter test',function (assert)
{
    var dummyURL = "http://*/showProduct.html";

    assert.equal($.urlParam('sortBy',dummyURL),undefined,"recognizes url withouth params"); //In the call of ecommerce, all undefined params get overwritten by the default values of the setting var

    dummyURL += "?sortBy=main_price&sortOrientation=asc"; //use window.history.pushState('','','?sortBy=main_price&sortOrientation=asc'); to do this on production

    assert.equal($.urlParam('sortBy', dummyURL),'main_price',"succesfully gets url parameter");
});

QUnit.test('product sort by url parameter main_price asc', function(assert)
{
    var $env = $('<div></div>');
    var done = assert.async();

    $($env).ecommerce({
        'column': 'main_price', 
        'direction': 'asc',
        'infinite_scroll': false,
        'onLoad': function(products)
        {
            for (var i = products.length - 1; i >= 0; i--)
            {
                console.log(products[i].main_price);
            }

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
            done();
        }
    });
});




QUnit.test('product sort by url parameter main_price desc', function(assert)
{
    var $env2 = $('<div></div>');
    var done = assert.async();

    $($env2).ecommerce({
        'column': 'main_price', 
        'direction': 'desc',
        'infinite_scroll': false,
        'onLoad': function (products)
        {
            assert.ok((products!=null),"loaded products");
            var result = true;

            for (var i = products.length - 1; i >= 0; i--) {
                console.log(products[i].main_price);
            }

            for (var i = 0; i < products.length-1; i++) 
            {
                if (products[i].main_price < products[i+1].main_price) 
                {
                    result = false;
                    break;
                }
            }

            assert.ok(result, "products all sorted by main_price descendant");
            done();
        }
    });
});

$.urlParam = function(name, locationURL) //added dummyURL for testing purposes
    {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(locationURL); //substitute locationURL for window.location.href in production
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
