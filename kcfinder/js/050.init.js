/** This file is part of KCFinder project
  *
  *      @desc Object initializations
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.init = function() {
    if (!_.checkAgent()) return;

    $('body').click(function() {
        _.menu.hide();
    }).rightClick();

    $('#menu').unbind().click(function() {
        return false;
    });

    _.initOpeners();
    _.initSettings();
    _.initContent();
    _.initToolbar();
    _.initResizer();
    _.initDropUpload();

    var div = $('<div></div>')
        .css({width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000})
        .prependTo('body').append('<div></div>').find('div').css({width: '100%', height: 200});
    _.scrollbarWidth = 100 - div.width();
    div.parent().remove();

    $.each($.agent, function(i) {
        if (i != "platform")
            $('body').addClass(i)
    });

    if ($.agent.platform)
        $.each($.agent.platform, function(i) {
            $('body').addClass(i)
        });

    if ($.mobile)
        $('body').addClass("mobile");
};

_.checkAgent = function() {
    if (($.agent.msie && !$.agent.opera && !$.agent.chromeframe && (parseInt($.agent.msie) < 9)) ||
        ($.agent.opera && (parseInt($.agent.version) < 10)) ||
        ($.agent.firefox && (parseFloat($.agent.firefox) < 1.8))
    ) {
        var html = '<div style="padding:10px">Your browser is not capable to display KCFinder. Please update your browser or install another one: <a href="http://www.mozilla.com/firefox/" target="_blank">Mozilla Firefox</a>, <a href="http://www.apple.com/safari" target="_blank">Apple Safari</a>, <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a>, <a href="http://www.opera.com/browser" target="_blank">Opera</a>.';
        if ($.agent.msie && !$.agent.opera)
            html += ' You may also install <a href="http://www.google.com/chromeframe" target="_blank">Google Chrome Frame ActiveX plugin</a> to get Internet Explorer 6, 7, 8 working.';
        html += '</div>';
        $('body').html(html);
        return false;
    }
    return true;
};

_.initOpeners = function() {

    try {

        // TinyMCE 3
        if (_.opener.name == "tinymce") {
            if (typeof tinyMCEPopup == "undefined")
                _.opener.name = null;
            else
                _.opener.callBack = true;

        // TinyMCE 4
        } else if (_.opener.name == "tinymce4")
            _.opener.callBack = true;

        // CKEditor
        else if (_.opener.name == "ckeditor") {
            if (window.parent && window.parent.CKEDITOR)
                _.opener.CKEditor.object = window.parent.CKEDITOR;
            else if (window.opener && window.opener.CKEDITOR) {
                _.opener.CKEditor.object = window.opener.CKEDITOR;
                _.opener.callBack = true;
            } else
                _.opener.CKEditor = null;

        // FCKeditor
        } else if ((!_.opener.name || (_.opener.name == "fckeditor")) && window.opener && window.opener.SetUrl) {
            _.opener.name = "fckeditor";
            _.opener.callBack = true;
        }

        // Custom callback
        if (!_.opener.callBack) {
            if ((window.opener && window.opener.KCFinder && window.opener.KCFinder.callBack) ||
                (window.parent && window.parent.KCFinder && window.parent.KCFinder.callBack)
            )
                _.opener.callBack = window.opener
                    ? window.opener.KCFinder.callBack
                    : window.parent.KCFinder.callBack;

            if ((
                    window.opener &&
                    window.opener.KCFinder &&
                    window.opener.KCFinder.callBackMultiple
                ) || (
                    window.parent &&
                    window.parent.KCFinder &&
                    window.parent.KCFinder.callBackMultiple
                )
            )
                _.opener.callBackMultiple = window.opener
                    ? window.opener.KCFinder.callBackMultiple
                    : window.parent.KCFinder.callBackMultiple;
        }

    } catch(e) {}
};

_.initContent = function() {
    $('div#folders').html(_.label("Loading folders..."));
    $('div#files').html(_.label("Loading files..."));
    $.ajax({
        type: "get",
        dataType: "json",
        url: _.getURL("init"),
        async: false,
        success: function(data) {
            if (_.check4errors(data))
                return;
            _.dirWritable = data.dirWritable;
            $('#folders').html(_.buildTree(data.tree));
            _.setTreeData(data.tree);
            _.setTitle("KCFinder: /" + _.dir);
            _.initFolders();
            _.files = data.files ? data.files : [];
            _.orderFiles();
        },
        error: function() {
            $('div#folders').html(_.label("Unknown error."));
            $('div#files').html(_.label("Unknown error."));
        }
    });
};

_.initResizer = function() {
    var cursor = ($.agent.opera) ? 'move' : 'col-resize';
    $('#resizer').css('cursor', cursor).draggable({
        axis: 'x',
        start: function() {
            $(this).css({
                opacity: "0.4",
                filter: "alpha(opacity=40)"
            });
            $('#all').css('cursor', cursor);
        },
        stop: function() {
            $(this).css({
                opacity: "0",
                filter: "alpha(opacity=0)"
            });
            $('#all').css('cursor', "");

            var jLeft = $('#left'),
                jRight = $('#right'),
                jFiles = $('#files'),
                jFolders = $('#folders'),
                left = parseInt($(this).css('left')) + parseInt($(this).css('width')),
                w = 0, r;

            $('#toolbar a').each(function() {
                if ($(this).css('display') != "none")
                    w += $(this).outerWidth(true);
            });

            r = $(window).width() - w;

            if (left < 100)
                left = 100;

            if (left > r)
                left = r;

            var right = $(window).width() - left;

            jLeft.css('width', left);
            jRight.css('width', right);
            jFiles.css('width', jRight.innerWidth() - jFiles.outerHSpace());

            $('#resizer').css({
                left: jLeft.outerWidth() - jFolders.outerRightSpace('m'),
                width: jFolders.outerRightSpace('m') + jFiles.outerLeftSpace('m')
            });

            _.fixFilesHeight();
        }
    });
};

_.resize = function() {
    var jLeft = $('#left'),
        jRight = $('#right'),
        jStatus = $('#status'),
        jFolders = $('#folders'),
        jFiles = $('#files'),
        jResizer = $('#resizer'),
        jWindow = $(window);

    jLeft.css({
        width: "25%",
        height: jWindow.height() - jStatus.outerHeight()
    });
    jRight.css({
        width: "75%",
        height: jWindow.height() - jStatus.outerHeight()
    });
    $('#toolbar').css('height', $('#toolbar a').outerHeight());

    jResizer.css('height', $(window).height());

    jFolders.css('height', jLeft.outerHeight() - jFolders.outerVSpace());
    _.fixFilesHeight();
    var width = jLeft.outerWidth() + jRight.outerWidth();
    jStatus.css('width', width);
    while (jStatus.outerWidth() > width)
        jStatus.css('width', parseInt(jStatus.css('width')) - 1);
    while (jStatus.outerWidth() < width)
        jStatus.css('width', parseInt(jStatus.css('width')) + 1);
    jFiles.css('width', jRight.innerWidth() - jFiles.outerHSpace());
    jResizer.css({
        left: jLeft.outerWidth() - jFolders.outerRightSpace('m'),
        width: jFolders.outerRightSpace('m') + jFiles.outerLeftSpace('m')
    });
};

_.setTitle = function(title) {
    document.title = title;
    if (_.opener.name == "tinymce")
        tinyMCEPopup.editor.windowManager.setTitle(window, title);
    else if (_.opener.name == "tinymce4") {
        var ifr = $('iframe[src*="browse.php?opener=tinymce4&"]', window.parent.document),
            path = ifr.attr('src').split('browse.php?')[0];
        ifr.parent().parent().find('div.mce-title').html('<span style="padding:0 0 0 28px;margin:-2px 0 -3px -6px;display:block;font-size:1em;font-weight:bold;background:url(' + path + 'themes/default/img/kcf_logo.png) left center no-repeat">' + title + '</span>');
    }
};

_.fixFilesHeight = function() {
    var jFiles = $('#files'),
        jSettings = $('#settings');

    jFiles.css('height',
        $('#left').outerHeight() - $('#toolbar').outerHeight() - jFiles.outerVSpace() -
        ((jSettings.css('display') != "none") ? jSettings.outerHeight() : 0)
    );
};
