/** This file is part of KCFinder project
  *
  *      @desc File related functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.initFiles = function() {
    $(document).unbind('keydown').keydown(function(e) {
        return !_.selectAll(e);
    });
    $('#files').unbind().scroll(function() {
        _.menu.hide();
    }).disableTextSelect();

    $('.file').unbind().click(function(e) {
        _.selectFile($(this), e);

    }).rightClick(function(el, e) {
        _.menuFile($(el), e);
    }).dblclick(function() {
        _.returnFile($(this));
    });

    if ($.mobile)
        $('.file').on('taphold', function() {
        _.menuFile($(this), {
            pageX: $(this).offset().left,
            pageY: $(this).offset().top + $(this).outerHeight()
        });
    });

    $.each(_.shows, function(i, val) {
        $('#files .file div.' + val).css('display', ($.$.kuki.get('show' + val) == "off") ? "none" : "block");
    });
    _.statusDir();
};

_.showFiles = function(callBack, selected) {
    _.fadeFiles();
    setTimeout(function() {
        var c = $('<div></div>');

        $.each(_.files, function(i, file) {
            var f, icon,
                stamp = file.size + "|" + file.mtime;

            // List
            if ($.$.kuki.get('view') == "list") {
                if (!i) c.html('<table></table>');

                icon = $.$.getFileExtension(file.name);
                if (file.thumb)
                    icon = ".image";
                else if (!icon.length || !file.smallIcon)
                    icon = ".";
                icon = "themes/" + _.theme + "/img/files/small/" + icon + ".png";

                f = $('<tr class="file"><td class="name thumb"></td><td class="time"></td><td class="size"></td></tr>');
                f.appendTo(c.find('table'));

            // Thumbnails
            } else {
                if (file.thumb)
                    icon = _.getURL('thumb') + "&file=" + encodeURIComponent(file.name) + "&dir=" + encodeURIComponent(_.dir) + "&stamp=" + stamp;
                else if (file.smallThumb) {
                    icon = _.uploadURL + "/" + _.dir + "/" + encodeURIComponent(file.name);
                    icon = $.$.escapeDirs(icon).replace(/\'/g, "%27");
                } else {
                    icon = file.bigIcon ? $.$.getFileExtension(file.name) : ".";
                    if (!icon.length) icon = ".";
                    icon = "themes/" + _.theme + "/img/files/big/" + icon + ".png";
                }
                f = $('<div class="file"><div class="thumb"></div><div class="name"></div><div class="time"></div><div class="size"></div></div>');
                f.appendTo(c);
            }

            f.find('.thumb').css({backgroundImage: 'url("' + icon + '")'});
            f.find('.name').html($.$.htmlData(file.name));
            f.find('.time').html(file.date);
            f.find('.size').html(_.humanSize(file.size));
            f.data(file);

            if ((file.name === selected) || $.$.inArray(file.name, selected))
                f.addClass('selected');
        });

        c.css({opacity:'', filter:''});
        $('#files').html(c);

        if (callBack) callBack();
        _.initFiles();
    }, 200);
};

_.selectFile = function(file, e) {

    // Click with Ctrl, Meta or Shift key
    if (e.ctrlKey || e.metaKey || e.shiftKey) {

        // Click with Shift key
        if (e.shiftKey && !file.hasClass('selected')) {
            var f = file.prev();
            while (f.get(0) && !f.hasClass('selected')) {
                f.addClass('selected');
                f = f.prev();
            }
        }

        file.toggleClass('selected');

        // Update statusbar
        var files = $('.file.selected').get(),
            size = 0, data;
        if (!files.length)
            _.statusDir();
        else {
            $.each(files, function(i, cfile) {
                size += $(cfile).data('size');
            });
            size = _.humanSize(size);
            if (files.length > 1)
                $('#fileinfo').html(files.length + " " + _.label("selected files") + " (" + size + ")");
            else {
                data = $(files[0]).data();
                $('#fileinfo').html($.$.htmlData(data.name) + " (" + _.humanSize(data.size) + ", " + data.date + ")");
            }
        }

    // Normal click
    } else {
        data = file.data();
        $('.file').removeClass('selected');
        file.addClass('selected');
        $('#fileinfo').html($.$.htmlData(data.name) + " (" + _.humanSize(data.size) + ", " + data.date + ")");
    }
};

_.selectAll = function(e) {
    if ((!e.ctrlKey && !e.metaKey) || ((e.keyCode != 65) && (e.keyCode != 97))) // Ctrl-A
        return false;

    var files = $('.file'),
        size = 0;

    if (files.length) {

        files.addClass('selected').each(function() {
            size += $(this).data('size');
        });

        $('#fileinfo').html(files.length + " " + _.label("selected files") + " (" + _.humanSize(size) + ")");
    }

    return true;
};

_.returnFile = function(file) {

    var button, win, fileURL = file.substr
        ? file : _.uploadURL + "/" + _.dir + "/" + file.data('name');
    fileURL = $.$.escapeDirs(fileURL);

    if (_.opener.name == "ckeditor") {
        _.opener.CKEditor.object.tools.callFunction(_.opener.CKEditor.funcNum, fileURL, "");
        window.close();

    } else if (_.opener.name == "fckeditor") {
        window.opener.SetUrl(fileURL) ;
        window.close() ;

    } else if (_.opener.name == "tinymce") {
        win = tinyMCEPopup.getWindowArg('window');
        win.document.getElementById(tinyMCEPopup.getWindowArg('input')).value = fileURL;
        if (win.getImageData) win.getImageData();
        if (typeof(win.ImageDialog) != "undefined") {
            if (win.ImageDialog.getImageData)
                win.ImageDialog.getImageData();
            if (win.ImageDialog.showPreviewImage)
                win.ImageDialog.showPreviewImage(fileURL);
        }
        tinyMCEPopup.close();

    } else if (_.opener.name == "tinymce4") {
        win = (window.opener ? window.opener : window.parent);
        $(win.document).find('#' + _.opener.TinyMCE.field).val(fileURL);
        win.tinyMCE.activeEditor.windowManager.close();

    } else if (_.opener.callBack) {

        if (window.opener && window.opener.KCFinder) {
            _.opener.callBack(fileURL);
            window.close();
        }

        if (window.parent && window.parent.KCFinder) {
            button = $('#toolbar a[href="kcact:maximize"]');
            if (button.hasClass('selected'))
                _.maximize(button);
            _.opener.callBack(fileURL);
        }

    } else if (_.opener.callBackMultiple) {
        if (window.opener && window.opener.KCFinder) {
            _.opener.callBackMultiple([fileURL]);
            window.close();
        }

        if (window.parent && window.parent.KCFinder) {
            button = $('#toolbar a[href="kcact:maximize"]');
            if (button.hasClass('selected'))
                _.maximize(button);
            _.opener.callBackMultiple([fileURL]);
        }

    }
};

_.returnFiles = function(files) {
    if (_.opener.callBackMultiple && files.length) {
        var rfiles = [];
        $.each(files, function(i, file) {
            rfiles[i] = _.uploadURL + "/" + _.dir + "/" + $(file).data('name');
            rfiles[i] = $.$.escapeDirs(rfiles[i]);
        });
        _.opener.callBackMultiple(rfiles);
        if (window.opener) window.close()
    }
};

_.returnThumbnails = function(files) {
    if (_.opener.callBackMultiple) {
        var rfiles = [], j = 0;
        $.each(files, function(i, file) {
            if ($(file).data('thumb')) {
                rfiles[j] = _.thumbsURL + "/" + _.dir + "/" + $(file).data('name');
                rfiles[j] = $.$.escapeDirs(rfiles[j++]);
            }
        });
        _.opener.callBackMultiple(rfiles);
        if (window.opener) window.close()
    }
};
