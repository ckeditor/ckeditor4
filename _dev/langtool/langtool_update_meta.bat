@ECHO OFF
::
:: Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Updates meta files, adding new empty entries for new strings.
:: "Meta" files contain descriptions for translators to help in understanding where each string is used.
::

CLS
ECHO.

SET PLUGINS=(a11yhelp devtools placeholder specialchar uicolor)
SET TARGETDIR=meta

mkdir %TARGETDIR%
:: Update meta file for core
java -jar langtool/langtool.jar update -c=config -f=meta -m=meta/ckeditor.core/meta.txt ../../_source/lang/ %TARGETDIR%/ckeditor.core/

:: Update meta files for plugins
for %%P in %PLUGINS% do (
java -jar langtool/langtool.jar update -c=config -f=meta -m=meta/ckeditor.plugin-%%P/meta.txt ../../_source/plugins/%%P/lang/ %TARGETDIR%/ckeditor.plugin-%%P/
)


