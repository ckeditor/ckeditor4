/** This file is part of KCFinder project
  *
  *      @desc Helper functions integrated in jQuery
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

(function($) {

    $.fn.selection = function(start, end) {
        var field = this.get(0);

        if (field.createTextRange) {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end-start);
            selRange.select();
        } else if (field.setSelectionRange) {
            field.setSelectionRange(start, end);
        } else if (field.selectionStart) {
            field.selectionStart = start;
            field.selectionEnd = end;
        }
        field.focus();
    };

    $.fn.disableTextSelect = function() {
        return this.each(function() {
            if ($.agent.firefox) { // Firefox
                $(this).css('MozUserSelect', "none");
            } else if ($.agent.msie) { // IE
                $(this).bind('selectstart', function() {
                    return false;
                });
            } else { //Opera, etc.
                $(this).mousedown(function() {
                    return false;
                });
            }
        });
    };

    $.fn.outerSpace = function(type, mbp) {
        var selector = this.get(0),
            r = 0, x;

        if (!mbp) mbp = "mbp";

        if (/m/i.test(mbp)) {
            x = parseInt($(selector).css('margin-' + type));
            if (x) r += x;
        }

        if (/b/i.test(mbp)) {
            x = parseInt($(selector).css('border-' + type + '-width'));
            if (x) r += x;
        }

        if (/p/i.test(mbp)) {
            x = parseInt($(selector).css('padding-' + type));
            if (x) r += x;
        }

        return r;
    };

    $.fn.outerLeftSpace = function(mbp) {
        return this.outerSpace('left', mbp);
    };

    $.fn.outerTopSpace = function(mbp) {
        return this.outerSpace('top', mbp);
    };

    $.fn.outerRightSpace = function(mbp) {
        return this.outerSpace('right', mbp);
    };

    $.fn.outerBottomSpace = function(mbp) {
        return this.outerSpace('bottom', mbp);
    };

    $.fn.outerHSpace = function(mbp) {
        return (this.outerLeftSpace(mbp) + this.outerRightSpace(mbp));
    };

    $.fn.outerVSpace = function(mbp) {
        return (this.outerTopSpace(mbp) + this.outerBottomSpace(mbp));
    };

    $.fn.fullscreen = function() {
        if (!$(this).get(0))
            return
        var t = $(this).get(0),
            requestMethod =
                t.requestFullScreen ||
                t.requestFullscreen ||
                t.webkitRequestFullScreen ||
                t.mozRequestFullScreen ||
                t.msRequestFullscreen;

        if (requestMethod)
            requestMethod.call(t);

        else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null)
                wscript.SendKeys("{F11}");
        }
    };

    $.fn.toggleFullscreen = function(doc) {
        if ($.isFullscreen(doc))
            $.exitFullscreen(doc);
        else
            $(this).fullscreen();
    };

    $.exitFullscreen = function(doc) {
        var d = doc ? doc : document,
            requestMethod =
                d.cancelFullScreen ||
                d.cancelFullscreen ||
                d.webkitCancelFullScreen ||
                d.mozCancelFullScreen ||
                d.msExitFullscreen ||
                d.exitFullscreen;

        if (requestMethod)
            requestMethod.call(d);

        else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null)
                wscript.SendKeys("{F11}");
        }
    };

    $.isFullscreen = function(doc) {
        var d = doc ? doc : document;
        return (d.fullScreenElement && (d.fullScreenElement !== null)) ||
               (d.fullscreenElement && (d.fullscreenElement !== null)) ||
               (d.msFullscreenElement && (d.msFullscreenElement !== null)) ||
               d.mozFullScreen || d.webkitIsFullScreen;
    };

    $.clearSelection = function() {
        if (document.selection)
            document.selection.empty();
        else if (window.getSelection)
            window.getSelection().removeAllRanges();
    };

    $.$ = {

        htmlValue: function(value) {
            return value
                .replace(/\&/g, "&amp;")
                .replace(/\"/g, "&quot;")
                .replace(/\'/g, "&#39;");
        },

        htmlData: function(value) {
            return value.toString()
                .replace(/\&/g, "&amp;")
                .replace(/\</g, "&lt;")
                .replace(/\>/g, "&gt;")
                .replace(/\ /g, "&nbsp;")
                .replace(/\"/g, "&quot;")
                .replace(/\'/g, "&#39;");
        },

        jsValue: function(value) {
            return value
                .replace(/\\/g, "\\\\")
                .replace(/\r?\n/, "\\\n")
                .replace(/\"/g, "\\\"")
                .replace(/\'/g, "\\'");
        },

        basename: function(path) {
            var expr = /^.*\/([^\/]+)\/?$/g;
            return expr.test(path)
                ? path.replace(expr, "$1")
                : path;
        },

        dirname: function(path) {
            var expr = /^(.*)\/[^\/]+\/?$/g;
            return expr.test(path)
                ? path.replace(expr, "$1")
                : '';
        },

        inArray: function(needle, arr) {
            if (!$.isArray(arr))
                return false;
            for (var i = 0; i < arr.length; i++)
                if (arr[i] == needle)
                    return true;
            return false;
        },

        getFileExtension: function(filename, toLower) {
            if (typeof toLower == 'undefined') toLower = true;
            if (/^.*\.[^\.]*$/.test(filename)) {
                var ext = filename.replace(/^.*\.([^\.]*)$/, "$1");
                return toLower ? ext.toLowerCase(ext) : ext;
            } else
                return "";
        },

        escapeDirs: function(path) {
            var fullDirExpr = /^([a-z]+)\:\/\/([^\/^\:]+)(\:(\d+))?\/(.+)$/,
                prefix = "";
            if (fullDirExpr.test(path)) {
                var port = path.replace(fullDirExpr, "$4");
                prefix = path.replace(fullDirExpr, "$1://$2");
                if (port.length)
                    prefix += ":" + port;
                prefix += "/";
                path = path.replace(fullDirExpr, "$5");
            }

            var dirs = path.split('/'),
                escapePath = '', i = 0;
            for (; i < dirs.length; i++)
                escapePath += encodeURIComponent(dirs[i]) + '/';

            return prefix + escapePath.substr(0, escapePath.length - 1);
        },

        kuki: {
            prefix: '',
            duration: 356,
            domain: '',
            path: '',
            secure: false,

            set: function(name, value, duration, domain, path, secure) {
                name = this.prefix + name;
                if (duration == null) duration = this.duration;
                if (secure == null) secure = this.secure;
                if ((domain == null) && this.domain) domain = this.domain;
                if ((path == null) && this.path) path = this.path;
                secure = secure ? true : false;

                var date = new Date();
                date.setTime(date.getTime() + (duration * 86400000));
                var expires = date.toGMTString();

                var str = name + '=' + value + '; expires=' + expires;
                if (domain != null) str += '; domain=' + domain;
                if (path != null) str += '; path=' + path;
                if (secure) str += '; secure';

                return (document.cookie = str) ? true : false;
            },

            get: function(name) {
                name = this.prefix + name;
                var nameEQ = name + '=';
                var kukis = document.cookie.split(';');
                var kuki;

                for (var i = 0; i < kukis.length; i++) {
                    kuki = kukis[i];
                    while (kuki.charAt(0) == ' ')
                        kuki = kuki.substring(1, kuki.length);

                    if (kuki.indexOf(nameEQ) == 0)
                        return kuki.substring(nameEQ.length, kuki.length);
                }

                return null;
            },

            del: function(name) {
                return this.set(name, '', -1);
            },

            isSet: function(name) {
                return (this.get(name) != null);
            }
        }

    };

})(jQuery);
