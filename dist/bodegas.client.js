/* jshint strict : false */

/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
(function(){function t(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(!window.addEventListener)return;var e=window.StyleFix={link:function(t){try{if(t.rel!=="stylesheet"||t.hasAttribute("data-noprefix"))return}catch(n){return}var r=t.href||t.getAttribute("data-href"),i=r.replace(/[^\/]+$/,""),s=(/^[a-z]{3,10}:/.exec(i)||[""])[0],o=(/^[a-z]{3,10}:\/\/[^\/]+/.exec(i)||[""])[0],u=/^([^?]*)\??/.exec(r)[1],a=t.parentNode,f=new XMLHttpRequest,l;f.onreadystatechange=function(){f.readyState===4&&l()};l=function(){var n=f.responseText;if(n&&t.parentNode&&(!f.status||f.status<400||f.status>600)){n=e.fix(n,!0,t);if(i){n=n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,n){return/^([a-z]{3,10}:|#)/i.test(n)?e:/^\/\//.test(n)?'url("'+s+n+'")':/^\//.test(n)?'url("'+o+n+'")':/^\?/.test(n)?'url("'+u+n+'")':'url("'+i+n+'")'});var r=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");n=n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+r,"gi"),"$1")}var l=document.createElement("style");l.textContent=n;l.media=t.media;l.disabled=t.disabled;l.setAttribute("data-href",t.getAttribute("href"));a.insertBefore(l,t);a.removeChild(t);l.media=t.media}};try{f.open("GET",r);f.send(null)}catch(n){if(typeof XDomainRequest!="undefined"){f=new XDomainRequest;f.onerror=f.onprogress=function(){};f.onload=l;f.open("GET",r);f.send(null)}}t.setAttribute("data-inprogress","")},styleElement:function(t){if(t.hasAttribute("data-noprefix"))return;var n=t.disabled;t.textContent=e.fix(t.textContent,!0,t);t.disabled=n},styleAttribute:function(t){var n=t.getAttribute("style");n=e.fix(n,!1,t);t.setAttribute("style",n)},process:function(){t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);t("style").forEach(StyleFix.styleElement);t("[style]").forEach(StyleFix.styleAttribute)},register:function(t,n){(e.fixers=e.fixers||[]).splice(n===undefined?e.fixers.length:n,0,t)},fix:function(t,n,r){for(var i=0;i<e.fixers.length;i++)t=e.fixers[i](t,n,r)||t;return t},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};(function(){setTimeout(function(){t('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})();(function(e){function t(e,t,r,i,s){e=n[e];if(e.length){var o=RegExp(t+"("+e.join("|")+")"+r,"gi");s=s.replace(o,i)}return s}if(!window.StyleFix||!window.getComputedStyle)return;var n=window.PrefixFree={prefixCSS:function(e,r,i){var s=n.prefix;n.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(e,t,n,r){return t+(n||"")+"linear-gradient("+(90-r)+"deg"}));e=t("functions","(\\s|:|,)","\\s*\\(","$1"+s+"$2(",e);e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+s+"$2$3",e);e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+s+"$2:",e);if(n.properties.length){var o=RegExp("\\b("+n.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,s+"$1")},e)}if(r){e=t("selectors","","\\b",n.prefixSelector,e);e=t("atrules","@","\\b","@"+s+"$1",e)}e=e.replace(RegExp("-"+s,"g"),"-");e=e.replace(/-\*-(?=[a-z]+)/gi,n.prefix);return e},property:function(e){return(n.properties.indexOf(e)>=0?n.prefix:"")+e},value:function(e,r){e=t("functions","(^|\\s|,)","\\s*\\(","$1"+n.prefix+"$2(",e);e=t("keywords","(^|\\s)","(\\s|$)","$1"+n.prefix+"$2$3",e);n.valueProperties.indexOf(r)>=0&&(e=t("properties","(^|\\s|,)","($|\\s|,)","$1"+n.prefix+"$2$3",e));return e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+n.prefix})},prefixProperty:function(e,t){var r=n.prefix+e;return t?StyleFix.camelCase(r):r}};(function(){var e={},t=[],r={},i=getComputedStyle(document.documentElement,null),s=document.createElement("div").style,o=function(n){if(n.charAt(0)==="-"){t.push(n);var r=n.split("-"),i=r[1];e[i]=++e[i]||1;while(r.length>3){r.pop();var s=r.join("-");u(s)&&t.indexOf(s)===-1&&t.push(s)}}},u=function(e){return StyleFix.camelCase(e)in s};if(i.length>0)for(var a=0;a<i.length;a++)o(i[a]);else for(var f in i)o(StyleFix.deCamelCase(f));var l={uses:0};for(var c in e){var h=e[c];l.uses<h&&(l={prefix:c,uses:h})}n.prefix="-"+l.prefix+"-";n.Prefix=StyleFix.camelCase(n.prefix);n.properties=[];for(var a=0;a<t.length;a++){var f=t[a];if(f.indexOf(n.prefix)===0){var p=f.slice(n.prefix.length);u(p)||n.properties.push(p)}}n.Prefix=="Ms"&&!("transform"in s)&&!("MsTransform"in s)&&"msTransform"in s&&n.properties.push("transform","transform-origin");n.properties.sort()})();(function(){function i(e,t){r[t]="";r[t]=e;return!!r[t]}var e={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};e["repeating-linear-gradient"]=e["repeating-radial-gradient"]=e["radial-gradient"]=e["linear-gradient"];var t={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display",grid:"display","inline-grid":"display","min-content":"width"};n.functions=[];n.keywords=[];var r=document.createElement("div").style;for(var s in e){var o=e[s],u=o.property,a=s+"("+o.params+")";!i(a,u)&&i(n.prefix+a,u)&&n.functions.push(s)}for(var f in t){var u=t[f];!i(f,u)&&i(n.prefix+f,u)&&n.keywords.push(f)}})();(function(){function s(e){i.textContent=e+"{}";return!!i.sheet.cssRules.length}var t={":read-only":null,":read-write":null,":any-link":null,"::selection":null},r={keyframes:"name",viewport:null,document:'regexp(".")'};n.selectors=[];n.atrules=[];var i=e.appendChild(document.createElement("style"));for(var o in t){var u=o+(t[o]?"("+t[o]+")":"");!s(u)&&s(n.prefixSelector(u))&&n.selectors.push(o)}for(var a in r){var u=a+" "+(r[a]||"");!s("@"+u)&&s("@"+n.prefix+u)&&n.atrules.push(a)}e.removeChild(i)})();n.valueProperties=["transition","transition-property"];e.className+=" "+n.prefix;StyleFix.register(n.prefixCSS)})(document.documentElement);

(function(){var e=!1,n="animation",t=prefix="",i=["Webkit","Moz","O","ms","Khtml"];$(window).load(function(){var a=document.body.style;if(void 0!==a.animationName&&(e=!0),e===!1)for(var o=0;o<i.length;o++)if(void 0!==a[i[o]+"AnimationName"]){prefix=i[o],n=prefix+"Animation",t="-"+prefix.toLowerCase()+"-",e=!0;break}});var a=function(e,n){return $.keyframe.debug&&console.log(e+" "+n),$("<style>"+n+"</style>").attr({"class":"keyframe-style",id:e,type:"text/css"}).appendTo("head")};$.keyframe={debug:!1,getVendorPrefix:function(){return t},isSupported:function(){return e},generate:function(e){var i=e.name||"",o="@"+t+"keyframes "+i+" {";for(var r in e)if("name"!==r&&"media"!==r&&"complete"!==r){o+=r+" {";for(var s in e[r])o+=s+":"+e[r][s]+";";o+="}"}o=PrefixFree.prefixCSS(o+"}"),e.media&&(o="@media "+e.media+"{"+o+"}");var f=$("style#"+e.name);if(f.length>0){f.append(o);var l=$("*").filter(function(){return this.style[n+"Name"]===i});l.each(function(){var e=$(this),n=e.data("keyframeOptions");e.resetKeyframe(function(){e.playKeyframe(n)})})}else a(i,o)},define:function(e){if(e.length)for(var n=0;n<e.length;n++){var t=e[n];this.generate(t)}else this.generate(e)}};var o="animation-play-state",r="running";$.fn.resetKeyframe=function(e){$(this).css(t+o,r).css(t+"animation","none");e&&setTimeout(e,1)},$.fn.pauseKeyframe=function(){$(this).css(t+o,"paused")},$.fn.resumeKeyframe=function(){$(this).css(t+o,r)},$.fn.playKeyframe=function(e,n){var i=function(e){return e=$.extend({duration:"0s",timingFunction:"ease",delay:"0s",iterationCount:1,direction:"normal",fillMode:"forwards"},e),[e.name,e.duration,e.timingFunction,e.delay,e.iterationCount,e.direction,e.fillMode].join(" ")},a="";if($.isArray(e)){for(var s=[],f=0;f<e.length;f++)s.push("string"==typeof e[f]?e[f]:i(e[f]));a=s.join(", ")}else a="string"==typeof e?e:i(e);var l=t+"animation",m=["webkit","moz","MS","o",""];!n&&e.complete&&(n=e.complete);var c=function(e,n,t){for(var i=0;i<m.length;i++){m[i]||(n=n.toLowerCase());var a=m[i]+n;e.off(a).on(a,t)}};return this.each(function(){var i=$(this).addClass("boostKeyframe").css(t+o,r).css(l,a).data("keyframeOptions",e);if($.keyframe.debug){console.group(),t&&console.log("Vendor Prefix: "+t),console.log("Style Applied: "+a);var s=i.css(l);console.log("Rendered Style: "+(s?s:i[0].style.animation)),console.groupEnd()}n&&(c(i,"AnimationIteration",n),c(i,"AnimationEnd",n))}),this},a("boost-keyframe"," .boostKeyframe{"+t+"transform:scale3d(1,1,1);}")}).call(this);

var SimpleAnimation = function()
{
    this.working = false;
    this.animation = {
        name : 'test',
        '0%' : {
            // 'transform' : 'translate(0px,0px)',
            'border-radius' : '0px'
        },
        '50%': {
            'transform' : 'translate(0px,0px)'
        },
        '100%': {
            // 'transform' : 'translate(0px, 0px)',
        }
    };
    this.animation_supported = this.isAnimationAvailable();


    this.init();
};


/**
 * detect if animation interfaz is available for this browser,
 * i copied from internet, so, in god we trust!!
 * @return {Boolean} true if css3 animations are supported
 */
SimpleAnimation.prototype.isAnimationAvailable = function() 
{
    var animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    pfx  = '',
    elm = document.createElement('div');

    if( elm.style.animationName !== undefined ) { animation = true; }    

    if( animation === false ) {
      for( var i = 0; i < domPrefixes.length; i++ ) {
        if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
          pfx = domPrefixes[ i ];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          break;
        }
      }
    }

    return animation;
};

SimpleAnimation.prototype.init = function() 
{
    var self = this;
    $(document).on('click', '.add-to-cart-animation', function()
    {
        try
        {
            var go_to = $('.shopping-cart-animation').offset();
            var imin = $(this).offset();
            var $tthis = $(this);
            var $clone = $tthis.clone();
            var agotado = ($tthis.html().indexOf('Agotado') !== -1);
            var outer_height = $tthis.outerHeight();
            var hwidth = $tthis.width() * 0.5 - outer_height * 0.5;

            if (self.working || agotado || !self.animation_supported)
            {
                return;
            }

            self.animation['50%']['margin-left'] 
            self.animation['50%']['border-radius'] = outer_height + 'px';
            self.animation['50%']['width'] = outer_height + 'px';
            self.animation['50%']['transform'] = 'translate('+hwidth+'px,0px)';

            self.animation['100%']['border-radius'] = outer_height + 'px';
            self.animation['100%']['width'] = outer_height + 'px';
            self.animation['100%'].transform = 'translate('+ (go_to.left - imin.left) +'px,'+(go_to.top - imin.top)+'px)';

            $.keyframe.define(self.animation);
            $clone.insertAfter($tthis);
            $clone.css('width', $tthis.width());
            $clone.css('height', outer_height);

            $tthis.css('display', 'none');
            $clone.html('');
            $clone.val('');
            $clone.css('outline', 'none');

            $clone.playKeyframe([
            'test 0.5s ease-in-out 0s forwards',
            {
                name: 'ball-roll',
                duration: '3s',
                timingFunction: 'ease',
                iterationCount: 1
            }], function(){
                $clone.remove();

                $tthis.fadeIn(200, function() {
                    self.working = false;
                    $tthis.css('opacity', 1);
                });
            });

            self.working = true;
        }
        catch(ex)
        {
            // nothing here...
        }
    });

};

/* global jQuery */
/* global Utils */
/* global Tag */
/* global Product */
/* global ShoppingCart */


'use strict';

var BodegasClient = function(checkout_url)
{
    this.app_public = '1000';
    this.site_id = 2;
    this.tag = null;
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;
};

BodegasClient.prototype.authenticate = function(app_public, callback) 
{
    var self = this;
    jQuery.get(Utils.getURL('authenticate', [app_public]), function(data)
    {
        if (data.success)
        {
            self.init(app_public);
            callback(self);
        }
    });
};


BodegasClient.prototype.init = function(site_id) 
{
    this.site_id = site_id;
    this.tag = new Tag(site_id);
    this.product = new Product(site_id);
    this.cart = new ShoppingCart(site_id, this.checkout_url);
};
/* global $ */
/* global Utils */

'use strict';

var ExtraInfo = function(cart_id)
{
    this.model = {};
    this.cart_id = cart_id;
};

ExtraInfo.prototype.set_data = function(index, data) 
{
    if (this._isValidIndex(index))
    {
        this.model[index] = data;

        this.synchronize();
        return true;
    }

    return false;
};

ExtraInfo.prototype.get_data = function(index) 
{
    try
    {
        return this.model[index];
    }
    catch(ex)
    {
        // nothing here
    }

    return false;
};


/******* private methods *********/

/**
 * only string and numbers are valid
 * @param  {object}  index this value will be validated
 * @return {Boolean}       true if is string or number
 */ 
ExtraInfo.prototype._isValidIndex = function(index) 
{
    if (typeof(index) === 'string')
        return true;

    if (!isNaN(parseInt(index)))
        return true;

    return false;
};

ExtraInfo.prototype.synchronize = function() 
{
    var json_string = JSON.stringify(this.model);
    $.post(
        Utils.getURL('cart', ['extra_info', this.cart_id]), 
        {'data' : json_string}, 
        function()
        {
            // nothing here...
        });
};
/* global BodegasClient */
/* global ProductListView */
/* global Utils */
/* global ProductDetailView */
/* global SimpleAnimation*/

'use strict';

(function ( $, window, document, undefined ) 
{
    // Create the defaults once
    var pluginName = 'ecommerce';
    var page = 1;
    var facade;
    var methods = {
        main : function(options)
        {
            facade = new EcommerceFacade(options);
            facade.showProductList(page);
            page++;

            return facade;
        },
        product_detail : function(options)
        {
            var facade = new EcommerceFacade(options);
            facade.showProductDetail();

            return facade;
        },
        load_more : function()
        {
            facade.showProductList(page);
            page++;

            return facade;
        },
        set_data : function(data)
        {
            facade.setData(data);

            return facade;
        }
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options_or_method, options ) 
    {
        var method = 'main';
        var settings = {
            'app_public' : 0,
            'products_per_page' : 12,
            'base_url' : 'http://localhost:8520/',
            'checkout_url': 'http://localhost:8522',
            'product_id' : null,
            'animation' : 'none',  // none|basic
            'ignore_stock' : false   // if true, shows all products
        };

        if (typeof(options_or_method) === 'string')
        {
            method = options_or_method;
        }
        else
        {
            options = options_or_method;
        }

        if (method !== 'set_data')
        {
            options = $.extend({}, settings, options);
            Utils.base_url = options.base_url;
        }

        return methods[method](options);
    };

})( jQuery, window, document ); // jshint ignore: line


var EcommerceFacade = function(options)
{
    var self = this;

    this.page = 1;
    this.options = options;
    this.ecommerce = new BodegasClient(this.options.checkout_url);
    this.view  = new ProductListView();
    this.product_view = new ProductDetailView();
    this.animation = null;

    // initialize animation
    if (options.animation !== 'none') 
    {
        // init simmple animations (the only one for now)
        this.animation = new SimpleAnimation();
    }

    this.view.onScrollEnd(function(){
        self.page++;
        self.showProductList(self.page);
    });
};


EcommerceFacade.prototype.showProductList = function(page) 
{
    //console.log(page);
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.tag.listAll(function(tags)
        {
            self.view.renderTags(tags);
        });

        var method = self.ecommerce.product.list;

        if (self.options.ignore_stock)
        {
            self.ecommerce.product.listIgnoringStock(
                page, 
                self.options.products_per_page, 
                Utils.getUrlParameter('tag'), 
                Utils.getUrlParameter('search_query'), 
                function(products)
                {
                    self.view.renderProducts(products);
                });
        }
        else
        {
            self.ecommerce.product.list(
                page, 
                self.options.products_per_page, 
                Utils.getUrlParameter('tag'), 
                Utils.getUrlParameter('search_query'), 
                function(products)
                {
                    self.view.renderProducts(products);
                });
        }
    });
};


EcommerceFacade.prototype.showProductDetail = function() 
{
    var product_id = this.options.product_id || Utils.getUrlParameter('id');
    var self = this;

    this.ecommerce.authenticate(this.options.app_public, function()
    {
        self.ecommerce.product.get(product_id, function(product)
        {
            self.product_view.render(product);
        });
    });

};


EcommerceFacade.prototype.setData = function(data) 
{
    if (typeof data === 'object')
    {
        for (var k in data)
        {
            this.ecommerce.cart.extra_info.set_data(k, data[k]);
        }
    }
    else if (typeof data === 'string')
    {
        this.ecommerce.cart.extra_info.set_data('extra', data);
    }
    else
    {
        this.ecommerce.cart.extra_info.set_data('extra', '' + data);
    }
};
/* globals jQuery */
/* globals Utils */

'use strict';

var Product = function(site_id)
{
    this.site_id = site_id;
};

Product.prototype.list = function(page, items_per_page, callback_or_tags, search_query, callback) 
{
    this._list(page, items_per_page, false, callback_or_tags, search_query, callback);
};

Product.prototype.listIgnoringStock = function(page, items_per_page, callback_or_tags, search_query, callback) 
{
    this._list(page, items_per_page, true, callback_or_tags, search_query, callback);
};

Product.prototype.get = function(product_id, callback) 
{
    jQuery.get(Utils.getURL('product', ['get', product_id]), function(product)
    {
        callback(product);
    });
};

Product.prototype._list = function(page, items_per_page, ignore_stock, callback_or_tags, search_query, callback) 
{
    var tags = 'false';
    var product_list = [];
    var term = '';

    if (typeof callback_or_tags === 'function')
    {
        callback = callback_or_tags;
    }
    else
    {
        tags = callback_or_tags;
    }

    if (tags === undefined || tags === '')
    {
        tags = 'false';
    }

    if (typeof search_query === 'function')
    {
        callback = search_query;
    }
    else if(search_query!==undefined)
    {
        term = search_query;
    }

    jQuery.post(Utils.getURLWithoutParam('product/search'), 
        {
            "site_id": this.site_id, 
            "page": page, 
            "items_per_page": items_per_page, 
            "tags": tags, 
            "ignore_stock": ignore_stock,
            "search_query": decodeURIComponent(term)
        },
        function(data)
        {
            if (data.products !== undefined)
            {
                product_list = data.products;
            }
            callback(product_list);
        });
};
/*global Utils*/
/*global $*/
/*global ShoppingCartView*/
/*global ExtraInfo*/

'use strict';

var ShoppingCart = function(site_id, checkout_url)
{

    this.extra_info = new ExtraInfo(1);
    this.model = [];
    this.guid = this.generateGUID();
    this.checkout_url = checkout_url === undefined ? '' : checkout_url;
    this.site_id = site_id === undefined ? 2 : site_id;
    this.view = new ShoppingCartView(this);

    this.loadCart();
};

ShoppingCart.prototype.generateGUID = function() 
{
    var old_guid = $.cookie('shopping-cart');
    var guid = old_guid;

    if (old_guid === undefined || old_guid === '')
    {
        guid = Utils.createUUID();  // request a new guid
        $.cookie('shopping-cart', guid);  // save to cookie
    }

    this.extra_info.cart_id = guid;
    return guid;
};

ShoppingCart.prototype.getGUID = function() 
{
    return this.guid;
};

ShoppingCart.prototype.getCheckoutUrl = function() 
{
    return this.checkout_url;
};

ShoppingCart.prototype.getSiteId = function() 
{
    return this.site_id;
};

ShoppingCart.prototype.saveModel = function() 
{
    $.post( 
        Utils.getURL('cart', ['save', this.guid]), 
        { 'json_data' : JSON.stringify(this.model) }, function()
        {
            //nothing here
        });
};

ShoppingCart.prototype.recalcTotals = function() 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        var p = this.model[i];

        p.total = p.quantity * p.price;
        p.upp_total = p.quantity * p.upp;
    }
};

ShoppingCart.prototype.addProduct = function(id, price, name, upp) 
{
    if (!this.productExist(id))
    {
        // upp = upp === undefined ? 1 : upp;  // protect this value

        this.model.push({ 
            'id' : parseInt(id), 
            'price' : price, 
            'name' : name, 
            'quantity' : 0,
            'upp': upp,
            'upp_total' : upp,
            'total' : price
        });
    } 

    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity += 1;
            this.model[i].total = this.model[i].quantity * this.model[i].price;
            this.model[i].upp_total = this.model[i].quantity * this.model[i].upp;
            this.saveModel();
            return;
        }
    }
};

ShoppingCart.prototype.removeProduct = function(id) 
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (parseInt(id) === this.model[i].id)
        {
            this.model.splice(i, 1);
            this.saveModel();
            return;
        }
    }
};

ShoppingCart.prototype.removeOne = function(id)
{
    for (var i = 0; i < this.model.length; i++) 
    {
        if (this.model[i].id === parseInt(id))
        {
            this.model[i].quantity -= 1;
            this.model[i].total = this.model[i].price * this.model[i].quantity;
            this.model[i].upp_total = this.model[i].quantity * this.model[i].upp;
            
            if (this.model[i].quantity <= 0)
            {
                this.removeProduct(id);
            }

            this.saveModel();
            return;
        }
    }

};

ShoppingCart.prototype.getProducts = function() 
{
    return this.model;
};

ShoppingCart.prototype.productExist = function(id) 
{
    var pid = parseInt(id);
    // get the product from model, if exist or create from database
    for (var i = 0; i < this.model.length; i++)
    {
        if (parseInt(this.model[i].id) === pid)
        {
            return true;
        }
    }
    return false;
};

ShoppingCart.prototype.getTotal = function() 
{
    var total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        total += product.price * product.quantity;
    }

    return total;
};

ShoppingCart.prototype.getUnitsTotal = function() 
{
    var units_total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        units_total += product.quantity;
    }

    return units_total;
};

/** upp == units per product */
ShoppingCart.prototype.getUPPTotal = function() 
{
    var units_total = 0;

    for (var i = 0; i < this.model.length; i++) 
    {
        var product = this.model[i];
        units_total += parseInt(product.upp_total);
    }

    return units_total;
};

ShoppingCart.prototype.loadCart = function(callback) 
{
    var self = this;
    var onload = callback === undefined ? $.noop : callback;

    $.get(Utils.getURL(
        'cart', 
        [
            'load', 
            this.getGUID()
        ]), function(cart_products)
    {
        if (cart_products.expired)
        {
            $.removeCookie('shopping-cart');
            self.guid = self.generateGUID();
            onload([]);
            return;
        }

        self.model = cart_products.products;
        self.recalcTotals();
        self.view.render();

        onload(cart_products);
    });
};
/* globals $*/
/* globals Utils */

'use strict';

var Tag = function(site_id)
{
    this.site_id = site_id;
};

Tag.prototype.listAll = function(callback) 
{
    $.get(Utils.getURL('tag', ['list_all', this.site_id]), function(data)
    {
        callback(data.tags);
    });
};
/*global $*/
'use strict';

var Utils = {  //jshint ignore: line
    base_url : 'http://apibodegas.ondev.today/',
    strEndsWith : function(str, suffix)
    {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    getURL : function(module, args) 
    {
        if (!Utils.strEndsWith(Utils.base_url, '/'))
        {
            Utils.base_url += '/';
        }

        var url = Utils.base_url + module + '/';

        if (args)
        {
            url += args.join('/');
        }

        return url;
    },
    getURLWithoutParam : function(module) 
    {
        if (!Utils.strEndsWith(Utils.base_url, '/'))
        {
            Utils.base_url += '/';
        }

        var url = Utils.base_url + module;

        return url;
    },
    friendly:function(t)
    {
        return Utils.URLBeautify(t);
    },
    extract_data:function(name, data)
    {
        name = $.trim(name);
        var splitted = [name];
        var fn = function(t){return t;};
        var d = '';

        if (name.indexOf('|') !== -1)
        {
            splitted = name.split('|');
            name = splitted[0];
            fn = Utils[splitted[1]];
        }
        
        d = data[$.trim(name)];

        d = d === undefined ? '' : d;
        return fn(d);
    },
    render : function(template, data)
    {
        if (template === undefined) return '';
        var builder = '';

        var splitted_template = template.split('{{');

        for (var i = 0; i < splitted_template.length; i++) 
        {
            var name = splitted_template[i].split('}}')[0];
            var html = splitted_template[i].split('}}')[1];
            html = html === undefined ? name : html;

            var d = Utils.extract_data(name, data);

            builder += d;
            builder += html;
        }

        return builder;
    },
    getUrlParameter: function(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) 
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) 
            {
                return sParameterName[1];
            }
        }
    },
    createUUID : function() 
    {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        var uuid = s.join('');
        return uuid;
    },
    /**
     * return an string with number formatted as price I.E $2.000
     * @param  {Number} n number to convert
     * @param  {Number} c decimal counter, by default 0
     * @param  {String} d decimal separator, by defailt ","
     * @param  {String} t unit separator, by default "."
     * @return {String}   string with price formatted number.
     */
    formatMoney : function(n, c, d, t)
    {
        c = isNaN(c = Math.abs(c)) ? 0 : c;
        d = d === undefined ? ',' : d;
        t = t === undefined ? '.' : t;
        var s = n < 0 ? '-' : '';
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '';
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return '$' + s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    },
    processPrice : function($tag)
    {
        $('.money', $tag).each(function()
        {
            var html = $(this).html();
            $(this).html(Utils.formatMoney(html));
        });
    },
    URLBeautify : function(text)
    {
        text = text.toLowerCase();

        var splitted = text.split(' ');
        text = splitted.join('_');

        text = text.split('ñ').join('n');
        text = text.split('á').join('a');
        text = text.split('é').join('e');
        text = text.split('í').join('i');
        text = text.split('ó').join('o');
        text = text.split('ú').join('u');

        text = text.split('?').join('');
        text = text.split('%').join('');
        text = text.split('$').join('');
        text = text.split('&').join('');
        text = text.split(',').join('');
        text = text.split('.').join('');

        text = text.split('/').join('');

        return text;
    }
};


/* globals Utils */
'use strict';

var ProductDetailView = function()
{
    this.template = '';

    this.initTemplates();
};

ProductDetailView.prototype.initTemplates = function() 
{
    this.template = $.trim($('#product_detail').html());
};

ProductDetailView.prototype.render = function(product) 
{
    var $el = $('.container');
    var $prod = $(Utils.render(this.template, product));
    var $images = $('.image', $prod);

    this.renderImages($images, product.id);

    $el.append($prod);
    Utils.processPrice($prod);
};

ProductDetailView.prototype.renderImages = function($images, product_id) 
{
    var self = this;
    var src = '';
    var $image = null;
    var url = Utils.getURL('product', ['images', product_id]);
    var counter = 0;

    $.get(url, function(data)
    {
        if (typeof(data) === 'string')
        {
            data = $.parseJSON(data);
        }

        $images.each(function()
        {
            if (data.images.length > counter)
            {
                src = data.images[counter].thumb_500;
                $image = $($images[counter]); // ensure jquery element

                self.loadImageToElement(src, $image);
            }

            counter++;
        });
    });

};

ProductDetailView.prototype.loadImageToElement = function(image_url, $el) 
{
    var $aux = $el.clone();
    $aux.load(function()
    {
        $el.replaceWith($aux);
    });
    $aux.fadeOut(function(){
        $aux.attr('src', image_url);
    });
    $aux.fadeIn();
};

/* global Utils */
/* global $*/

'use strict';

var ProductListView = function()
{
    this.all_products_loaded = false;
    this.loading_products = false;
    this.tag_template = '';
    this.product_template = '';
    this.site_search_template = '';
    this.on_scroll_end = $.noop;
    this.site_search = $("#site_search");

    this.renderLoading();
    this.initTemplates();
    this.renderSiteSearch(this.site_search_template);
};

ProductListView.prototype.initTemplates = function() 
{
    this.tag_template = $.trim($('#tag_template').html());
    this.product_template = $.trim($('#product_template').html());
    this.site_search_template = $.trim($('#site_search_template').html());
    this.init();
};


ProductListView.prototype.init = function() 
{
    var self = this;

    $(document).on('scroll', function()
    {
        if (self.loading_products) return;  // if this flag is enabled then don`t load

        var $products = $('.products');
        var $loading = $('.spinner', $products);

        // check if loading is in viewport
        if($(window).scrollTop() >= $(document).height() - $(window).height() - 400)
        {
            self.loading_products = true;
            self.on_scroll_end();
        }
    });

};

ProductListView.prototype.onScrollEnd = function(callback) 
{
    this.on_scroll_end = callback;
};

ProductListView.prototype.renderTags = function(tags) 
{
    // detect if tags are list
    if (tags === undefined) return;

    var $menu = $('.menu ul');
    for (var i = 0; i < tags.length; i++) 
    {
        var tag = tags[i];
        var rendered = Utils.render(this.tag_template, tag);

        $menu.append(rendered);
    }
};


ProductListView.prototype.renderProducts = function(products) 
{
    var $products_view = $('.products');

    if (products.length > 0)
    {
        for (var i = 0; i < products.length; i++) 
        {
            var product = products[i];

            var $rendered = $(Utils.render(this.product_template, product));
            Utils.processPrice($rendered);

            this.renderProductImage($('.product-image', $rendered), product.id, $('.product-image-href', $rendered));

            if (product.balance_units === 0)
            {
                this.showSoldOut($rendered);
            }

            $products_view.append($rendered);
        }

        this.renderLoading();
    }
    else
    {
        this.all_products_loaded = true;
        this.removeLoading();
    }
};


ProductListView.prototype.showSoldOut = function($rendered) 
{
    $('.add-to-cart', $rendered).addClass('product-sold-out');
    $('.add-to-cart', $rendered).html('Agotado');  // @todo: add dictionary
    $('.add-to-cart', $rendered).val('Agotado');
};

ProductListView.prototype.removeLoading = function() 
{
    var $products = $('.products');
    $('.spinner', $products).remove();
};

ProductListView.prototype.renderLoading = function() 
{
    this.removeLoading();
    if (!this.all_products_loaded)
    {
        var $products = $('.products');
        $products.append($('#product_loading').html());
    }

    this.loading_products = false;
};


ProductListView.prototype.renderProductImage = function($image, product_id, $imagehref) 
{
    var url = Utils.getURL('product', ['images', product_id]);

    $.get(url, function(data)
    {
        if (typeof(data) === 'string')
        {
            data = $.parseJSON(data);
        }

        if (data.images.length > 0)
        {
            var src = data.images[0].thumb_500;
            var $aux = $image.clone();

            $aux.load(function()
            {
                $image.replaceWith($aux);
            });
            $aux.fadeOut(function(){
                if($imagehref.length>0){
                    $imagehref.attr("href", src);
                }
                $aux.attr('src', src);
            });
            $aux.fadeIn();
        }
    });
};

ProductListView.prototype.renderSiteSearch = function(template) 
{
    if(this.site_search.length){
        var tag = Utils.getUrlParameter('tag');
        var search_query = Utils.getUrlParameter('search_query');

        if(search_query !== undefined){
            search_query = decodeURIComponent(search_query).replace(/\+/g, ' ');
        }
        var rendered = Utils.render(
                        template, 
                        { 
                            'tag' : tag,
                            'search_query' : search_query
                        });
        this.site_search.append(rendered);

        if(tag === undefined || tag === '') {
            if($("input[name=tag]", this.site_search).length){
                $(".tag-search", this.site_search).css("display","none");
            }
        }

        if($("a.remove-tag", this.site_search).length){
            $("a.remove-tag", this.site_search).on('click', function(){
                $("input[name=tag]", this.site_search).val('');
                $("input[name=search_query]", this.site_search).val($("input[name=search_query]", this.site_search).val());
                $(".btn-search", this.site_search).trigger("click");
            });
        }

        // if(tag !== undefined){
        //     $("#site_search input[name=tag]").tagsInput({
        //         'height':'45px',
        //         'width':'auto',
        //         'defaultText':''
        //     });
        // }
        // $("#site_search input[name=search_query]").tagEditor({ initialTags: tag.split(",") });
    }
};

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
        removeFromCart : '.remove-from-cart',
        addOne : '.add-one',
        removeOne : '.remove-one'
    };

    this.$cart_div = $('.shopping-cart');
    this.$cart_container = $('.cart-container');
    this.$total_items = $('#total_items');
    this.$total_cart = $('#total_cart');
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

    this.controller.addProduct(id, price, name, upp);
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
                'total' : this.controller.getTotal()
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
        $(".units-total").html($units_total);

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