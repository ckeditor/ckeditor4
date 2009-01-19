#
# Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license
#
# Calls the JavaScript Lint (jsl) with the predefined configurations.
# If a file name is passed as a parameter it writes there the results,
# otherwise it simply outputs it.
#

if [ "$1" = "" ]
then
	../_thirdparty/jsl/jsl -conf lint.conf -nofilelisting -nologo
else
	echo Generating $1 ...
	../_thirdparty/jsl/jsl -conf lint.conf -nofilelisting -nologo > $1
	echo
	echo Process completed.
fi
