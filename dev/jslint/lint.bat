@ECHO OFF
::
:: Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.md or http://ckeditor.com/license
::
:: Calls the JavaScript Lint (jsl) with the predefined configurations.
:: If a file name is passed as a parameter it writes there the results,
:: otherwise it simply outputs it.
::

IF "%1"=="" GOTO NoParam

ECHO Generating %1...
bin\jsl -conf lint.conf -nofilelisting -nologo > %1

ECHO.
ECHO Process completed.
ECHO.

GOTO End

:NoParam

"../_thirdparty/jsl/jsl.exe" -conf lint.conf -nofilelisting -nologo

ECHO.

:End
