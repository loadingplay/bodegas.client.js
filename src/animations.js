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
