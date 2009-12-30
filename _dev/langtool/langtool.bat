@ECHO OFF
::
:: Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Checks translation files in given directory.
::

CLS
ECHO.

java -jar langtool/langtool.jar ../../_source/lang
