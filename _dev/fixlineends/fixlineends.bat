@ECHO OFF
::
:: Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::

php fixlineends.php --excluderegex=/(?:_dev[\\\/]_thirdparty)/ --eolstripwhite --eofnewline --eofstripwhite --nohidden --nosystem ../../
