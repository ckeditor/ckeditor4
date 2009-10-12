#!/usr/bin/env bash

# Copyright (c) 2003-2009, Frederico Caldeira Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

pushd $DIR
java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.0 SVN" ckeditor_3.0_svn
popd
