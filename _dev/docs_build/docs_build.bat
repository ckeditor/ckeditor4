@ECHO OFF
::
:: Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
:: Builds the documentation files.
::

ECHO Building the API document into the api_docs directory...

del /F /Q "api_docs/*.*"

java -jar ../_thirdparty/jsdoc-toolkit/jsrun.jar ../_thirdparty/jsdoc-toolkit/app/run.js -c=docs_build.conf

:: php ../fixlineends/fixlineends.php --eolstripwhite --eofnewline --eofstripwhite --nohidden --nosystem api_docs/

ECHO Finished!
