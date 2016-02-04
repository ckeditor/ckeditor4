/** This file is part of KCFinder project
  *
  *      @desc Toolbar functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.initToolbar = function() {
    $('#toolbar').disableTextSelect();
    $('#toolbar a').click(function() {
        _.menu.hide();
    });

    if (!$.$.kuki.isSet('displaySettings'))
        $.$.kuki.set('displaySettings', "off");

    if ($.$.kuki.get('displaySettings') == "on") {
        $('#toolbar a[href="kcact:settings"]').addClass('selected');
        $('#settings').show();
        _.resize();
    }

    $('#toolbar a[href="kcact:settings"]').click(function () {
        var jSettings = $('#settings');
        if (jSettings.css('display') == "none") {
            $(this).addClass('selected');
            $.$.kuki.set('displaySettings', "on");
            jSettings.show();
            _.fixFilesHeight();
        } else {
            $(this).removeClass('selected');
            $.$.kuki.set('displaySettings', "off");
            jSettings.hide();
            _.fixFilesHeight();
        }
        return false;
    });

    $('#toolbar a[href="kcact:refresh"]').click(function() {
        _.refresh();
        return false;
    });

    $('#toolbar a[href="kcact:maximize"]').click(function() {
        _.maximize(this);
        return false;
    });

    $('#toolbar a[href="kcact:about"]').click(function() {
        var html = '<div class="box about">' +
            '<div class="head"><a href="http://kcfinder.sunhater.com" target="_blank">KCFinder</a> ' + _.version + '</div>';
        if (_.support.check4Update)
            html += '<div id="checkver"><span class="loading"><span>' + _.label("Checking for new version...") + '</span></span></div>';
        html +=
            '<div>' + _.label("Licenses:") + ' <a href="http://opensource.org/licenses/GPL-3.0" target="_blank">GPLv3</a> & <a href="http://opensource.org/licenses/LGPL-3.0" target="_blank">LGPLv3</a></div>' +
            '<div>Copyright &copy;2010-2014 Pavel Tzonkov</div>' +
        '</div>';

        var dlg = _.dialog(_.label("About"), html, {width: 301});

        setTimeout(function() {
            $.ajax({
                dataType: "json",
                url: _.getURL('check4Update'),
                async: true,
                success: function(data) {
                    if (!dlg.html().length)
                        return;
                    var span = $('#checkver');
                    span.removeClass('loading');
                    if (!data.version) {
                        span.html(_.label("Unable to connect!"));
                        return;
                    }
                    if (_.version < data.version)
                        span.html('<a href="http://kcfinder.sunhater.com/download" target="_blank">' + _.label("Download version {version} now!", {version: data.version}) + '</a>');
                    else
                        span.html(_.label("KCFinder is up to date!"));
                },
                error: function() {
                    if (!dlg.html().length)
                        return;
                    $('#checkver').removeClass('loading').html(_.label("Unable to connect!"));
                }
            });
        }, 1000);

        return false;
    });

    _.initUploadButton();
};

_.initUploadButton = function() {
    var btn = $('#toolbar a[href="kcact:upload"]');
    if (!_.access.files.upload) {
        btn.hide();
        return;
    }
    var top = btn.get(0).offsetTop,
        width = btn.outerWidth(),
        height = btn.outerHeight(),
        jInput = $('#upload input');

    $('#toolbar').prepend('<div id="upload" style="top:' + top + 'px;width:' + width + 'px;height:' + height + 'px"><form enctype="multipart/form-data" method="post" target="uploadResponse" action="' + _.getURL('upload') + '"><input type="file" name="upload[]" onchange="_.uploadFile(this.form)" style="height:' + height + 'px" multiple="multiple" /><input type="hidden" name="dir" value="" /></form></div>');
    jInput.css('margin-left', "-" + (jInput.outerWidth() - width));
    $('#upload').mouseover(function() {
        $('#toolbar a[href="kcact:upload"]').addClass('hover');
    }).mouseout(function() {
        $('#toolbar a[href="kcact:upload"]').removeClass('hover');
    });
};

_.uploadFile = function(form) {
    if (!_.dirWritable) {
        _.alert(_.label("Cannot write to upload folder."));
        $('#upload').detach();
        _.initUploadButton();
        return;
    }
    form.elements[1].value = _.dir;
    $('<iframe id="uploadResponse" name="uploadResponse" src="javascript:;"></iframe>').prependTo(document.body);
    $('#loading').html(_.label("Uploading file...")).show();
    form.submit();
    $('#uploadResponse').load(function() {
        var response = $(this).contents().find('body').text();
        $('#loading').hide();
        response = response.split("\n");

        var selected = [], errors = [];
        $.each(response, function(i, row) {
            if (row.substr(0, 1) == "/")
                selected[selected.length] = row.substr(1, row.length - 1);
            else
                errors[errors.length] = row;
        });
        if (errors.length) {
            errors = errors.join("\n");
            if (errors.replace(/^\s+/g, "").replace(/\s+$/g, "").length)
                _.alert(errors);
        }
        if (!selected.length)
            selected = null;
        _.refresh(selected);
        $('#upload').detach();
        setTimeout(function() {
            $('#uploadResponse').detach();
        }, 1);
        _.initUploadButton();
    });
};

_.maximize = function(button) {

    // TINYMCE 3
    if (_.opener.name == "tinymce") {

        var par = window.parent.document,
            ifr = $('iframe[src*="browse.php?opener=tinymce&"]', par),
            id =  parseInt(ifr.attr('id').replace(/^mce_(\d+)_ifr$/, "$1")),
            win = $('#mce_' + id, par);

        if ($(button).hasClass('selected')) {
            $(button).removeClass('selected');
            win.css({
                left: _.maximizeMCE.left,
                top: _.maximizeMCE.top,
                width: _.maximizeMCE.width,
                height: _.maximizeMCE.height
            });
            ifr.css({
                width: _.maximizeMCE.width - _.maximizeMCE.Hspace,
                height: _.maximizeMCE.height - _.maximizeMCE.Vspace
            });

        } else {
            $(button).addClass('selected')
            _.maximizeMCE = {
                width: parseInt(win.css('width')),
                height: parseInt(win.css('height')),
                left: win.position().left,
                top: win.position().top,
                Hspace: parseInt(win.css('width')) - parseInt(ifr.css('width')),
                Vspace: parseInt(win.css('height')) - parseInt(ifr.css('height'))
            };
            var width = $(window.top).width(),
                height = $(window.top).height();
            win.css({
                left: $(window.parent).scrollLeft(),
                top: $(window.parent).scrollTop(),
                width: width,
                height: height
            });
            ifr.css({
                width: width - _.maximizeMCE.Hspace,
                height: height - _.maximizeMCE.Vspace
            });
        }

    // TINYMCE 4
    } else if (_.opener.name == "tinymce4") {

        var par = window.parent.document,
            ifr = $('iframe[src*="browse.php?opener=tinymce4&"]', par).parent(),
            win = ifr.parent();

        if ($(button).hasClass('selected')) {
            $(button).removeClass('selected');

            win.css({
                left: _.maximizeMCE4.left,
                top: _.maximizeMCE4.top,
                width: _.maximizeMCE4.width,
                height: _.maximizeMCE4.height
            });

            ifr.css({
                width: _.maximizeMCE4.width,
                height: _.maximizeMCE4.height - _.maximizeMCE4.Vspace
            });

        } else {
            $(button).addClass('selected');

            _.maximizeMCE4 = {
                width: parseInt(win.css('width')),
                height: parseInt(win.css('height')),
                left: win.position().left,
                top: win.position().top,
                Vspace: win.outerHeight(true) - ifr.outerHeight(true) - 1
            };

            var width = $(window.top).width(),
                height = $(window.top).height();

            win.css({
                left: 0,
                top: 0,
                width: width,
                height: height
            });

            ifr.css({
                width: width,
                height: height - _.maximizeMCE4.Vspace
            });
        }

    // PUPUP WINDOW
    } else if (window.opener) {
        window.moveTo(0, 0);
        width = screen.availWidth;
        height = screen.availHeight;
        if ($.agent.opera)
            height -= 50;
        window.resizeTo(width, height);

    } else {
        if (window.parent) {
            var el = null;
            $(window.parent.document).find('iframe').each(function() {
                if (this.src.replace('/?', '?') == window.location.href.replace('/?', '?')) {
                    el = this;
                    return false;
                }
            });

            // IFRAME
            if (el !== null)
                $(el).toggleFullscreen(window.parent.document);

            // SELF WINDOW
            else
                $('body').toggleFullscreen();

        } else
            $('body').toggleFullscreen();
    }
};

_.refresh = function(selected) {
    _.fadeFiles();
    $.ajax({
        type: "post",
        dataType: "json",
        url: _.getURL("chDir"),
        data: {dir: _.dir},
        async: false,
        success: function(data) {
            if (_.check4errors(data)) {
                $('#files > div').css({opacity: "", filter: ""});
                return;
            }
            _.dirWritable = data.dirWritable;
            _.files = data.files ? data.files : [];
            _.orderFiles(null, selected);
            _.statusDir();
        },
        error: function() {
            $('#files > div').css({opacity: "", filter: ""});
            $('#files').html(_.label("Unknown error."));
        }
    });
};
