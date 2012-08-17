#!/bin/bash
# Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

set -e

echo "Building the API document into the api_docs directory..."
echo ""

# Move to the script directory.
cd $(dirname $0)

jsduck ../../core ../../plugins ../../ckeditor.js -o api_docs \
	--stats \
	--title="CKEditor 4 JavaScript API Documentation" \
	--head-html="<link rel='stylesheet' href='resources/css/ck.css' type='text/css' />" \
	--footer="Copyright © 2003-2012, <a href='http://cksource.com' style='color: #085585'>CKSource</a> - Frederico Knabben. All rights reserved. |
	Generated with <a href='https://github.com/senchalabs/jsduck'>JSDuck</a> 4.0.0."

echo "Copying customizations into resources..."
cp -r resources api_docs

echo ""
echo "Finished!"