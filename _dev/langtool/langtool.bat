@ECHO OFF
::
:: Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Checks translation files in given directory.
::


@ECHO OFF

CLS
ECHO.

:: rmdir /S /Q release

java -cp js.jar org.mozilla.javascript.tools.shell.Main langtool.js ../../_source/lang
