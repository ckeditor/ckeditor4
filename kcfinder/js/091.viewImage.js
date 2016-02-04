/** This file is part of KCFinder project
  *
  *      @desc Image viewer
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.viewImage = function(data) {

    var ts = new Date().getTime(),
        dlg = false,
        images = [],

    showImage = function(data) {
        _.lock = true;
        $('#loading').html(_.label("Loading image...")).show();

        var url = $.$.escapeDirs(_.uploadURL + "/" + _.dir + "/" + data.name) + "?ts=" + ts,
            img = new Image(),
            i = $(img),
            w = $(window),
            d = $(document);

        onImgLoad = function() {
            _.lock = false;

            $('#files .file').each(function() {
                if ($(this).data('name') == data.name) {
                    _.ssImage = this;
                    return false;
                }
            });

            i.hide().appendTo('body');

            var o_w = i.width(),
                o_h = i.height(),
                i_w = o_w,
                i_h = o_h,

                goTo = function(i) {
                    if (!_.lock) {
                        var nimg = images[i];
                        _.currImg = i;
                        showImage(nimg);
                    }
                },

                nextFunc = function() {
                    goTo((_.currImg >= images.length - 1) ? 0 : (_.currImg + 1));
                },

                prevFunc = function() {
                    goTo((_.currImg ? _.currImg : images.length) - 1);
                },

                t = $('<div></div>');

            i.detach().appendTo(t);
            t.addClass("img");

            if (!dlg) {

                var ww = w.width() - 60,

                closeFunc = function() {
                    d.unbind('keydown').keydown(function(e) {
                        return !_.selectAll(e);
                    });
                    dlg.dialog('destroy').detach();
                };

                if ((ww % 2)) ww++;

                dlg = _.dialog($.$.htmlData(data.name), t.get(0), {
                    width: ww,
                    height: w.height() - 36,
                    position: [30, 30],
                    draggable: false,
                    nopadding: true,
                    close: closeFunc,
                    show: false,
                    hide: false,
                    buttons: [
                        {
                            text: _.label("Previous"),
                            icons: {primary: "ui-icon-triangle-1-w"},
                            click: prevFunc

                        }, {
                            text: _.label("Next"),
                            icons: {secondary: "ui-icon-triangle-1-e"},
                            click: nextFunc

                        }, {
                            text: _.label("Select"),
                            icons: {primary: "ui-icon-check"},
                            click: function(e) {
                                d.unbind('keydown').keydown(function(e) {
                                    return !_.selectAll(e);
                                });
                                if (_.ssImage) {
                                    _.selectFile($(_.ssImage), e);
                                }
                                dlg.dialog('destroy').detach();
                            }

                        }, {
                            text: _.label("Close"),
                            icons: {primary: "ui-icon-closethick"},
                            click: closeFunc
                        }
                    ]
                });

                dlg.addClass('kcfImageViewer').css('overflow', "hidden").parent().find('.ui-dialog-buttonpane button').get(2).focus();

            } else {
                dlg.prev().find('.ui-dialog-title').html($.$.htmlData(data.name));
                dlg.html(t.get(0));
            }

            dlg.unbind('click').click(nextFunc).disableTextSelect();

            var d_w = dlg.innerWidth(),
                d_h = dlg.innerHeight();

            if ((o_w > d_w) || (o_h > d_h)) {
                i_w = d_w;
                i_h = d_h;
                if ((d_w / d_h) > (o_w / o_h))
                    i_w = parseInt((o_w * d_h) / o_h);
                else if ((d_w / d_h) < (o_w / o_h))
                    i_h = parseInt((o_h * d_w) / o_w);
            }

            i.css({
                width: i_w,
                height: i_h
            }).show().parent().css({
                display: "block",
                margin: "0 auto",
                width: i_w,
                height: i_h,
                marginTop: parseInt((d_h - i_h) / 2)
            });

            $('#loading').hide();

            d.unbind('keydown').keydown(function(e) {
                if (!_.lock) {
                    var kc = e.keyCode;
                    if ((kc == 37)) prevFunc();
                    if ((kc == 39)) nextFunc();
                }
            });
        };

        img.src = url;

        if (img.complete)
            onImgLoad();
        else {
            img.onload = onImgLoad;
            img.onerror = function() {
                _.lock = false;
                $('#loading').hide();
                _.alert(_.label("Unknown error."));
                d.unbind('keydown').keydown(function(e) {
                    return !_.selectAll(e);
                });
                _.refresh();
            };
        }
    };

    $.each(_.files, function(i, file) {
        var i = images.length;
        if (file.thumb || file.smallThumb)
            images[i] = file;
        if (file.name == data.name)
            _.currImg = i;
    });

    showImage(data);
    return false;
};
