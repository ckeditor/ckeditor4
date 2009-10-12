#!/usr/bin/env bash

# Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

pushd $DIR
java -jar ckpackager/ckpackager.jar ../../ckeditor.pack
popd
