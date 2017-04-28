/** This file is part of KCFinder project
  *
  *      @desc Settings panel functionality
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

_.initSettings = function() {
    $('#settings').disableTextSelect();
    $('#settings fieldset, #settings input, #settings label').uniform();

    if (!_.shows.length)
        $('#show input[type="checkbox"]').each(function(i) {
            _.shows[i] = this.name;
        });

    var shows = _.shows;

    if (!$.$.kuki.isSet('showname')) {
        $.$.kuki.set('showname', "on");
        $.each(shows, function (i, val) {
            if (val != "name") $.$.kuki.set('show' + val, "off");
        });
    }

    $('#show input[type="checkbox"]').click(function() {
        $.$.kuki.set('show' + this.name, this.checked ? "on" : "off")
        $('#files .file div.' + this.name).css('display', this.checked ? "block" : "none");
    });

    $.each(shows, function(i, val) {
        $('#show input[name="' + val + '"]').get(0).checked = ($.$.kuki.get('show' + val) == "on") ? "checked" : "";
    });

    if (!_.orders.length)
        $('#order input[type="radio"]').each(function(i) {
            _.orders[i] = this.value;
        })

    var orders = _.orders;

    if (!$.$.kuki.isSet('order'))
        $.$.kuki.set('order', "name");

    if (!$.$.kuki.isSet('orderDesc'))
        $.$.kuki.set('orderDesc', "off");

    $('#order input[value="' + $.$.kuki.get('order') + '"]').get(0).checked = true;
    $('#order input[name="desc"]').get(0).checked = ($.$.kuki.get('orderDesc') == "on");

    $('#order input[type="radio"]').click(function() {
        $.$.kuki.set('order', this.value);
        _.orderFiles();
    });

    $('#order input[name="desc"]').click(function() {
        $.$.kuki.set('orderDesc', this.checked ? 'on' : "off");
        _.orderFiles();
    });

    if (!$.$.kuki.isSet('view'))
        $.$.kuki.set('view', "thumbs");

    if ($.$.kuki.get('view') == "list")
        $('#show').parent().hide();

    $('#view input[value="' + $.$.kuki.get('view') + '"]').get(0).checked = true;

    $('#view input').click(function() {
        var view = this.value;
        if ($.$.kuki.get('view') != view) {
            $.$.kuki.set('view', view);
            if (view == "list")
                $('#show').parent().hide();
            else
                $('#show').parent().show();
        }
        _.fixFilesHeight();
        _.refresh();
    });
};
