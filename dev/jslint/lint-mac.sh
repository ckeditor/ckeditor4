#!/usr/bin/env bash

#
# Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or http://ckeditor.com/license
#
# Calls the JavaScript Lint (jsl) with the predefined configurations.
# If a file name is passed as a parameter it writes there the results,
# otherwise it simply outputs it.
#

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

pushd $DIR
if [ "$1" = "" ]
then
	../_thirdparty/jsl/jsl -conf lint.conf -nofilelisting -nologo
else
	echo Generating $1 ...
	../_thirdparty/jsl/jsl -conf lint.conf -nofilelisting -nologo > $1
	echo
	echo Process completed.
fi
popd
