/** This file is part of KCFinder project
  *
  *      @desc Miscellaneous functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.orderFiles = function(callBack, selected) {
    var order = $.$.kuki.get('order'),
        desc = ($.$.kuki.get('orderDesc') == "on"),
        a1, b1, arr;

    if (!_.files || !_.files.sort)
        _.files = [];

    _.files = _.files.sort(function(a, b) {
        if (!order) order = "name";

        if (order == "date") {
            a1 = a.mtime;
            b1 = b.mtime;
        } else if (order == "type") {
            a1 = $.$.getFileExtension(a.name);
            b1 = $.$.getFileExtension(b.name);
        } else if (order == "size") {
            a1 = a.size;
            b1 = b.size;
        } else {
            a1 = a[order].toLowerCase();
            b1 = b[order].toLowerCase();
        }

        if ((order == "size") || (order == "date")) {
            if (a1 < b1) return desc ? 1 : -1;
            if (a1 > b1) return desc ? -1 : 1;
        }

        if (a1 == b1) {
            a1 = a.name.toLowerCase();
            b1 = b.name.toLowerCase();
            arr = [a1, b1];
            arr = arr.sort();
            return (arr[0] == a1) ? -1 : 1;
        }

        arr = [a1, b1];
        arr = arr.sort();
        if (arr[0] == a1) return desc ? 1 : -1;
        return desc ? -1 : 1;
    });

    _.showFiles(callBack, selected);
    _.initFiles();
};

_.humanSize = function(size) {
    if (size < 1024) {
        size = size.toString() + " B";
    } else if (size < 1048576) {
        size /= 1024;
        size = parseInt(size).toString() + " KB";
    } else if (size < 1073741824) {
        size /= 1048576;
        size = parseInt(size).toString() + " MB";
    } else if (size < 1099511627776) {
        size /= 1073741824;
        size = parseInt(size).toString() + " GB";
    } else {
        size /= 1099511627776;
        size = parseInt(size).toString() + " TB";
    }
    return size;
};

_.getURL = function(act) {
    var url = "browse.php?type=" + encodeURIComponent(_.type) + "&lng=" + encodeURIComponent(_.lang);
    if (_.opener.name)
        url += "&opener=" + encodeURIComponent(_.opener.name);
    if (act)
        url += "&act=" + encodeURIComponent(act);
    if (_.cms)
        url += "&cms=" + encodeURIComponent(_.cms);
    return url;
};

_.label = function(index, data) {
    var label = _.labels[index] ? _.labels[index] : index;
    if (data)
        $.each(data, function(key, val) {
            label = label.replace("{" + key + "}", val);
        });
    return label;
};

_.check4errors = function(data) {
    if (!data.error)
        return false;
    var msg = data.error.join
        ? data.error.join("\n")
        : data.error;
    _.alert(msg);
    return true;
};

_.post = function(url, data) {
    var html = '<form id="postForm" method="post" action="' + url + '">';
    $.each(data, function(key, val) {
        if ($.isArray(val))
            $.each(val, function(i, aval) {
                html += '<input type="hidden" name="' + $.$.htmlValue(key) + '[]" value="' + $.$.htmlValue(aval) + '" />';
            });
        else
            html += '<input type="hidden" name="' + $.$.htmlValue(key) + '" value="' + $.$.htmlValue(val) + '" />';
    });
    html += '</form>';
    $('#menu').html(html).show();
    $('#postForm').get(0).submit();
};

_.fadeFiles = function() {
    $('#files > div').css({
        opacity: "0.4",
        filter: "alpha(opacity=40)"
    });
};
