:: Copyright (c) 2003-2009, Frederico Caldeira Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license

@ECHO OFF

CLS
ECHO.

:: rmdir /S /Q release

cd ckreleaser
java -cp js.jar;tools/javatar/tar.jar;tools/tartool/tartool.jar;tools/jaf/activation.jar org.mozilla.javascript.tools.shell.Main ckreleaser.js ../ckreleaser.release ../../.. ../release 0.1 ckeditor_0.1.zip ckeditor_0.1.tar.gz
cd ..
