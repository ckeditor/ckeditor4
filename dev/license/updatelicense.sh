#!/bin/bash

# Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

DIR="$( cd "$(dirname "$0")" ; pwd -P )"
TOOLPATH="$DIR/updatelicense.js"
cd $DIR
node $TOOLPATH