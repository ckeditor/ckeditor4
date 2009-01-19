@ECHO OFF
::
:: Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Build the _docs/api documentation files.
::

ECHO Building the API document at _docs/api...

del /F /Q "../../_docs/api/*.*"

java -jar ../_thirdparty/jsdoc-toolkit/jsrun.jar ../_thirdparty/jsdoc-toolkit/app/run.js -c=docs_build.conf

:: php ../fixlineends/fixlineends.php --eolstripwhite --eofnewline --eofstripwhite --nohidden --nosystem ../../_docs/api/

ECHO Finished!
