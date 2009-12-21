#!/usr/bin/env bash

# Copyright (c) 2003-2009, Frederico Caldeira Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

LANGTOOL="$(cd $(dirname "$0"); pwd)/langtool.sh"

pushd $DIR
java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.1 SVN" ckeditor_3.1_svn --run-before-release=$LANGTOOL
popd
