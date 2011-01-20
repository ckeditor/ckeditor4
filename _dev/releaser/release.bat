::
:: Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::

@ECHO OFF

CLS
ECHO.

:: rmdir /S /Q release

java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.5.1 (SVN)" ckeditor_3.5.1_svn --run-before-release=langtool.bat
