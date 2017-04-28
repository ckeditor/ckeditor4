/** This file is part of KCFinder project
  *
  *      @desc Folder related functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.initFolders = function() {
    $('#folders').scroll(function() {
        _.menu.hide();
    }).disableTextSelect();
    $('div.folder > a').unbind().click(function() {
        _.menu.hide();
        return false;
    });
    $('div.folder > a > span.brace').unbind().click(function() {
        if ($(this).hasClass('opened') || $(this).hasClass('closed'))
            _.expandDir($(this).parent());
    });
    $('div.folder > a > span.folder').unbind().click(function() {
        _.changeDir($(this).parent());
    }).rightClick(function(el, e) {
        _.menuDir($(el).parent(), e);
    });
    if ($.mobile) {
        $('div.folder > a > span.folder').on('taphold', function() {
            _.menuDir($(this).parent(), {
                pageX: $(this).offset().left + 1,
                pageY: $(this).offset().top + $(this).outerHeight()
            });
        });
    }
};

_.setTreeData = function(data, path) {
    if (!path)
        path = "";
    else if (path.length && (path.substr(path.length - 1, 1) != '/'))
        path += "/";
    path += data.name;
    var selector = '#folders a[href="kcdir:/' + $.$.escapeDirs(path) + '"]';
    $(selector).data({
        name: data.name,
        path: path,
        readable: data.readable,
        writable: data.writable,
        removable: data.removable,
        hasDirs: data.hasDirs
    });
    $(selector + ' span.folder').addClass(data.current ? 'current' : 'regular');
    if (data.dirs && data.dirs.length) {
        $(selector + ' span.brace').addClass('opened');
        $.each(data.dirs, function(i, cdir) {
            _.setTreeData(cdir, path + "/");
        });
    } else if (data.hasDirs)
        $(selector + ' span.brace').addClass('closed');
};

_.buildTree = function(root, path) {
    if (!path) path = "";
    path += root.name;
    var cdir, html = '<div class="folder"><a href="kcdir:/' + $.$.escapeDirs(path) + '"><span class="brace">&nbsp;</span><span class="folder">' + $.$.htmlData(root.name) + '</span></a>';
    if (root.dirs) {
        html += '<div class="folders">';
        for (var i = 0; i < root.dirs.length; i++) {
            cdir = root.dirs[i];
            html += _.buildTree(cdir, path + "/");
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
};

_.expandDir = function(dir) {
    var path = dir.data('path');
    if (dir.children('.brace').hasClass('opened')) {
        dir.parent().children('.folders').hide(500, function() {
            if (path == _.dir.substr(0, path.length))
                _.changeDir(dir);
        });
        dir.children('.brace').removeClass('opened').addClass('closed');
    } else {
        if (dir.parent().children('.folders').get(0)) {
            dir.parent().children('.folders').show(500);
            dir.children('.brace').removeClass('closed').addClass('opened');
        } else if (!$('#loadingDirs').get(0)) {
            dir.parent().append('<div id="loadingDirs">' + _.label("Loading folders...") + '</div>');
            $('#loadingDirs').hide().show(200, function() {
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: _.getURL("expand"),
                    data: {dir: path},
                    async: false,
                    success: function(data) {
                        $('#loadingDirs').hide(200, function() {
                            $('#loadingDirs').detach();
                        });
                        if (_.check4errors(data))
                            return;

                        var html = "";
                        $.each(data.dirs, function(i, cdir) {
                            html += '<div class="folder"><a href="kcdir:/' + $.$.escapeDirs(path + '/' + cdir.name) + '"><span class="brace">&nbsp;</span><span class="folder">' + $.$.htmlData(cdir.name) + '</span></a></div>';
                        });
                        if (html.length) {
                            dir.parent().append('<div class="folders">' + html + '</div>');
                            var folders = $(dir.parent().children('.folders').first());
                            folders.hide();
                            $(folders).show(500);
                            $.each(data.dirs, function(i, cdir) {
                                _.setTreeData(cdir, path);
                            });
                        }
                        if (data.dirs.length)
                            dir.children('.brace').removeClass('closed').addClass('opened');
                        else
                            dir.children('.brace').removeClass('opened closed');
                        _.initFolders();
                        _.initDropUpload();
                    },
                    error: function() {
                        $('#loadingDirs').detach();
                        _.alert(_.label("Unknown error."));
                    }
                });
            });
        }
    }
};

_.changeDir = function(dir) {
    if (dir.children('span.folder').hasClass('regular')) {
        $('div.folder > a > span.folder').removeClass('current regular').addClass('regular');
        dir.children('span.folder').removeClass('regular').addClass('current');
        $('#files').html(_.label("Loading files..."));
        $.ajax({
            type: "post",
            dataType: "json",
            url: _.getURL("chDir"),
            data: {dir: dir.data('path')},
            async: false,
            success: function(data) {
                if (_.check4errors(data))
                    return;
                _.files = data.files;
                _.orderFiles();
                _.dir = dir.data('path');
                _.dirWritable = data.dirWritable;
                _.setTitle("KCFinder: /" + _.dir);
                _.statusDir();
            },
            error: function() {
                $('#files').html(_.label("Unknown error."));
            }
        });
    }
};

_.statusDir = function() {
    var i = 0, size = 0;
    for (; i < _.files.length; i++)
        size += _.files[i].size;
    size = _.humanSize(size);
    $('#fileinfo').html(_.files.length + " " + _.label("files") + " (" + size + ")");
};

_.refreshDir = function(dir) {
    var path = dir.data('path');
    if (dir.children('.brace').hasClass('opened') || dir.children('.brace').hasClass('closed'))
        dir.children('.brace').removeClass('opened').addClass('closed');
    dir.parent().children('.folders').first().detach();
    if (path == _.dir.substr(0, path.length))
        _.changeDir(dir);
    _.expandDir(dir);
    return true;
};
