/**
 * Set of utilities for rendering html templates
 * @see http://gogs.ondev.today/loadingplay/bodegas.cliente.js
 * @author Ricardo Silva
 */


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
    hide_if_empty:function(t)
    {
        if ($.trim(t) === '')
            return 'hidden';

        return '';
    },
    hide_if_not_empty:function(t)
    {
        if ($.trim(t) !== '')
            return 'hidden';

        return '';
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

        try
        {
            d = eval('data.' + $.trim(name));  // jshint ignore: line
        }
        catch(e)
        {
            // nothing here...
        }

        d = d === undefined ? '' : d;
        return fn(d);
    },
    // formatMoney Alias
    money:function(n)
    {
        return Utils.formatMoney(n);
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

