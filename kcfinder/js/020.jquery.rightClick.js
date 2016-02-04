/** This file is part of KCFinder project
  *
  *      @desc Right Click jQuery Plugin
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

(function($) {
    $.fn.rightClick = function(func) {
        var events = "contextmenu rightclick";
        $(this).each(function() {
            $(this).unbind(events).bind(events, function(e) {
                e.preventDefault();
                $.clearSelection();
                if ($.isFunction(func))
                    func(this, e);
            });
        });
        return $(this);
    };
})(jQuery);