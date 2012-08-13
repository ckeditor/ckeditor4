#!/bin/bash
# Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

set -e

echo "Building the API document into the api_docs directory..."
echo ""

# Move to the script directory.
cd $(dirname $0)

jsduck ../../core ../../plugins ../../ckeditor.js -o api_docs

echo ""
echo "Finished!"