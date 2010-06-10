::
:: Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::

@ECHO OFF

CLS
ECHO.

:: rmdir /S /Q release

java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.3.2 SVN" ckeditor_3.3.2_svn --run-before-release=langtool.bat
