@ECHO OFF
::
:: Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Checks translation files in given directory.
::

CLS
ECHO.

java -jar langtool/langtool.jar update ../../_source/lang
