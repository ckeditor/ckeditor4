@ECHO OFF
::
:: Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Generates .po translation files using JavaScript language files as source files.
:: PO file can be used to update translations in CKEditor UI Translation Center:
:: https://www.transifex.net/projects/p/ckeditor/
::

CLS
ECHO.

SET PLUGINS=(a11yhelp devtools placeholder specialchar uicolor)
SET TARGETDIR=po

:: Cleanup target folder
IF NOT EXIST %TARGETDIR% GOTO :start
SET /P ANSWER=The target directory ("%TARGETDIR%") already exists. Do you want to delete it (y/n)?
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
echo Target directory already exists ("%TARGETDIR%"), nothing to do.
exit /b 1
:yes
rmdir /S /Q %TARGETDIR%

:start
mkdir %TARGETDIR%
:: Generate po file for core
java -jar langtool/langtool.jar export -c=config -f=gettext -m=meta/ckeditor.core/meta.txt ../../_source/lang/ %TARGETDIR%/ckeditor.core/

:: Generate po files for plugins
for %%P in %PLUGINS% do (
java -jar langtool/langtool.jar export -c=config -f=gettext -m=meta/ckeditor.plugin-%%P/meta.txt ../../_source/plugins/%%P/lang/ %TARGETDIR%/ckeditor.plugin-%%P/
)
