#!/usr/bin/env bash

# Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

# Checks translation files in given directory.

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

pushd $DIR
java -jar langtool/langtool.jar update ../../_source/lang
popd
