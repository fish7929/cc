/**
 * @component CSSCore.js
 * @description css的一些通用方法，主要是给原生js用
 * @time 2017-03-30 11:06
 * @author fishYu
 **/
const core_rnotwhite = /\S+/g;
const rclass = /[\t\r\n]/g;
const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
const core_trim = "X".trim;

const CSSCore = {

    addClass : function(elem, value) {

        var classes, cur, clazz, j,
            proceed = typeof value === "string" && value;

        if ( proceed ) {
            // The disjunction here is for better compressibility (see removeClass)
            classes = ( value || "" ).match( core_rnotwhite ) || [];

            cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        " "
                );

            if ( cur ) {
                j = 0;
                while ( (clazz = classes[j++]) ) {
                    if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                        cur += clazz + " ";
                    }
                }
                elem.className = this.trim( cur );

            }

        }

        return this;

    },

    removeClass : function(elem, value) {
        var classes, cur, clazz, j,
            proceed = arguments.length === 0 || typeof value === "string" && value;

        if ( proceed ) {
            classes = ( value || "" ).match( core_rnotwhite ) || [];

            cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        ""
                );

            if ( cur ) {
                j = 0;
                while ( (clazz = classes[j++]) ) {
                    while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                        cur = cur.replace( " " + clazz + " ", " " );
                    }
                }
                elem.className = value ? this.trim( cur ) : "";
            }
        }
        return this;
    },

    css : function(element, style, value) {
        if ( typeof style == 'object') {
            value = value || 2;
            for (var ss in style) {
                if (value == 2)
                    CSSCore.css2(element, ss, style[ss]);
                else
                    CSSCore.css3(element, ss, style[ss]);
            }
            //return null;
        } else {
            CSSCore.css2(element, style, value);
        }
        return this;
    },

    css2 : function(element, style, value) {
        if (!(value === undefined)) {
            element.style['' + style] = value;
            return value;
        } else {
            var computedStyle = getComputedStyle(element, '');
            return element.style['' + style] || computedStyle.getPropertyValue('' + style);
        }
    },

    css3j : function(element, style, value) {
        element.style[style] = '-webkit-' + value;
        element.style[style] = '-moz-' + value;
        element.style[style] = '-ms-' + value;
        element.style[style] = '-o-' + value;
        element.style[style] = '' + value;
    },

    css3 : function(element, style, value) {
        var fixStyle = style.charAt(0).toUpperCase() + style.substr(1);
        if (!(value === undefined)) {
            element.style['webkit' + fixStyle] = value;
            element.style['moz' + fixStyle] = value;
            element.style['ms' + fixStyle] = value;
            element.style['o' + fixStyle] = value;
            element.style['' + style] = value;
        } else {
            return CSSCore.getCss3(element, style);
        }
    },

    getCss3 : function(element, style) {
        var computedStyle = getComputedStyle(element, '');
        var a = element.style['' + style] || element.style['-webkit-' + style] || element.style['-o-' + style] || element.style['-ms-' + style] || element.style['-moz-' + style];
        var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('-webkit- ' + style) || computedStyle.getPropertyValue('-o-' + style) || computedStyle.getPropertyValue('-ms-' + style) || computedStyle.getPropertyValue('-moz-' + style);
        return a || b;

        // var computedStyle = getComputedStyle(element, '');
        // var a = element.style['' + style] || element.style['Webkit' + fixStyle] || element.style['Moz' + fixStyle] || element.style['O' + fixStyle] || element.style['ms' + fixStyle];
        // var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('Webkit' + fixStyle) || computedStyle.getPropertyValue('Moz' + fixStyle) || computedStyle.getPropertyValue('O' + fixStyle) || computedStyle.getPropertyValue('ms' + fixStyle);
        // return a || b;
    },

    hasClass : function(element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },

    trim : core_trim && !core_trim.call("\uFEFF\xA0") ?
        function( text ) {
            return text == null ?
                "" :
                core_trim.call( text );
        } :

        // Otherwise use our own trimming functionality
        function( text ) {
            return text == null ?
                "" :
                ( text + "" ).replace( rtrim, "" );
        }
};

export default CSSCore;