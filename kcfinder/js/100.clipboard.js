/** This file is part of KCFinder project
  *
  *      @desc Clipboard functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.initClipboard = function() {
    if (!_.clipboard || !_.clipboard.length) return;

    var size = 0,
        jClipboard = $('#clipboard');

    $.each(_.clipboard, function(i, val) {
        size += val.size;
    });
    size = _.humanSize(size);
    jClipboard.disableTextSelect().html('<div title="' + _.label("Clipboard") + ' (' + _.clipboard.length + ' ' + _.label("files") + ', ' + size + ')" onclick="_.openClipboard()"></div>');
    var resize = function() {
        jClipboard.css({
            left: $(window).width() - jClipboard.outerWidth(),
            top: $(window).height() - jClipboard.outerHeight()
        });
    };
    resize();
    jClipboard.show();
    $(window).unbind().resize(function() {
        _.resize();
        resize();
    });
};

_.removeFromClipboard = function(i) {
    if (!_.clipboard || !_.clipboard[i]) return false;
    if (_.clipboard.length == 1) {
        _.clearClipboard();
        _.menu.hide();
        return;
    }

    if (i < _.clipboard.length - 1) {
        var last = _.clipboard.slice(i + 1);
        _.clipboard = _.clipboard.slice(0, i);
        _.clipboard = _.clipboard.concat(last);
    } else
        _.clipboard.pop();

    _.initClipboard();
    _.menu.hide();
    _.openClipboard();
    return true;
};

_.copyClipboard = function(dir) {
    if (!_.clipboard || !_.clipboard.length) return;
    var files = [],
        failed = 0;
    for (i = 0; i < _.clipboard.length; i++)
        if (_.clipboard[i].readable)
            files[i] = _.clipboard[i].dir + "/" + _.clipboard[i].name;
        else
            failed++;
    if (_.clipboard.length == failed) {
        _.alert(_.label("The files in the Clipboard are not readable."));
        return;
    }
    var go = function(callBack) {
        if (dir == _.dir)
            _.fadeFiles();
        $.ajax({
            type: "post",
            dataType: "json",
            url: _.getURL("cp_cbd"),
            data: {dir: dir, files: files},
            async: false,
            success: function(data) {
                if (callBack) callBack();
                _.check4errors(data);
                _.clearClipboard();
                if (dir == _.dir)
                    _.refresh();
            },
            error: function() {
                if (callBack) callBack();
                $('#files > div').css({
                    opacity: "",
                    filter: ""
                });
                _.alert(_.label("Unknown error."));
            }
        });
    };

    if (failed)
        _.confirm(
            _.label("{count} files in the Clipboard are not readable. Do you want to copy the rest?", {count:failed}),
            go
        )
    else
        go();

};

_.moveClipboard = function(dir) {
    if (!_.clipboard || !_.clipboard.length) return;
    var files = [],
        failed = 0;
    for (i = 0; i < _.clipboard.length; i++)
        if (_.clipboard[i].readable && _.clipboard[i].writable)
            files[i] = _.clipboard[i].dir + "/" + _.clipboard[i].name;
        else
            failed++;
    if (_.clipboard.length == failed) {
        _.alert(_.label("The files in the Clipboard are not movable."))
        return;
    }

    var go = function(callBack) {
        _.fadeFiles();
        $.ajax({
            type: "post",
            dataType: "json",
            url: _.getURL("mv_cbd"),
            data: {dir: dir, files: files},
            async: false,
            success: function(data) {
                if (callBack) callBack();
                _.check4errors(data);
                _.clearClipboard();
                _.refresh();
            },
            error: function() {
                if (callBack) callBack();
                $('#files > div').css({
                    opacity: "",
                    filter: ""
                });
                _.alert(_.label("Unknown error."));
            }
        });
    };

    if (failed)
        _.confirm(
            _.label("{count} files in the Clipboard are not movable. Do you want to move the rest?", {count: failed}),
            go
        );
    else
        go();
};

_.deleteClipboard = function() {
    if (!_.clipboard || !_.clipboard.length) return;
    var files = [],
        failed = 0;
    for (i = 0; i < _.clipboard.length; i++)
        if (_.clipboard[i].readable && _.clipboard[i].writable)
            files[i] = _.clipboard[i].dir + "/" + _.clipboard[i].name;
        else
            failed++;
    if (_.clipboard.length == failed) {
        _.alert(_.label("The files in the Clipboard are not removable."))
        return;
    }
    var go = function(callBack) {
        _.fadeFiles();
        $.ajax({
            type: "post",
            dataType: "json",
            url: _.getURL("rm_cbd"),
            data: {files:files},
            async: false,
            success: function(data) {
                if (callBack) callBack();
                _.check4errors(data);
                _.clearClipboard();
                _.refresh();
            },
            error: function() {
                if (callBack) callBack();
                $('#files > div').css({
                    opacity: "",
                    filter: ""
                });
                _.alert(_.label("Unknown error."));
            }
        });
    };
    if (failed)
        _.confirm(
            _.label("{count} files in the Clipboard are not removable. Do you want to delete the rest?", {count: failed}),
            go
        );
    else
        go();
};

_.downloadClipboard = function() {
    if (!_.clipboard || !_.clipboard.length) return;
    var files = [];
    for (i = 0; i < _.clipboard.length; i++)
        if (_.clipboard[i].readable)
            files[i] = _.clipboard[i].dir + "/" + _.clipboard[i].name;
    if (files.length)
        _.post(_.getURL('downloadClipboard'), {files:files});
};

_.clearClipboard = function() {
    $('#clipboard').html("");
    _.clipboard = [];
};
