(function($)
{
    /** cookie functions */
    function createCookie(name, value, days) 
    {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }
    /** /cookie functions */
    var s4 = function() 
    {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    };

    var uuid = function()
    {
        return s4() + '-' + s4() + '-' + s4() + '-' + s4();
    };

    $.analytics = function(method, data, callback)
    {
        callback = callback === undefined ? $.noop : callback;
        method = method === undefined ? 'main' : method;

        if (window.ga === undefined)
        {
            return false;
        }

        // if (method === 'main')
        // {
        //     var ondev_url = 'https://www.google-analytics.com/analytics_debug.js';
        //     var prod_url = 'https://www.google-analytics.com/analytics.js';

        //     var analytics_url = is_prod ? prod_url:ondev_url;

        //     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        //     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        //     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        //     })(window,document,'script',analytics_url,'ga');

        //     ga('create', data.url_code, 'auto');
        //     ga('send', 'pageview');
        //     ga('require', 'ec');
        // }

        if (method === 'product-add')
        {
            ga('ec:addProduct', data);

            ga('ec:setAction', 'add');
            ga('send', 'event', 'UX', 'click', 'add to cart');
            // ga('send', 'pageview');
        }

        if (method === 'product-detail')
        {
            ga('ec:addProduct', data);

            ga('ec:setAction', 'detail');
            ga('send', 'pageview');
        }

        if (method === 'product-remove')
        {
            ga('ec:addProduct', data);

            ga('ec:setAction', 'remove');
            ga('send', 'event', 'UX', 'click', 'remove from cart');
            //ga('send', 'pageview');
        }

        if (method === 'product-add-cart')
        {
            ga('ec:addProduct', data);
        }

        if (method === 'send-checkout')
        {

            // console.log("the cookie", readCookie("shopping_cart"));
            var step = 1;
            var current_step = readCookie('analytics_step');

            try
            {
                step = parseInt(data);
                current_step = parseInt(current_step);
            }
            catch (ex)
            {
                console.error(data, 'cannot be parsed to int in checkout steps');
            }

            if (data === '1')
            {
                createCookie('analytics_id', uuid(), 1);
                createCookie('analytics_step', 0, 1);
            }

            if (step <= current_step)
            {
                console.error("el paso " + step + " ya fue ejecutado");
                return;
            }

            if (data === '5')
            {
                // alert(s4() + "-" + s4() + "-" + s4() + "-" + s4());
                ga('ec:setAction', 'purchase', {
                  'id': readCookie('analytics_id') === null ? uuid() : readCookie('analytics_id'),
                  'affiliation': 'Store - Online'
                });
            }
            else
            {
                ga('ec:setAction','checkout', {
                    'step': data
                });
            }

            // assure step dont repeat
            createCookie('analytics_step', step, 1);

            ga('send', 'pageview', {
                hitCallback: callback
            });
        }
    };

})(jQuery);
