#!/bin/bash
# Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

#
# README
#
# To build docs you need to have JSDuck installed in your OS,
# so global 'jsduck' script is available.
#
# The easiest way to do this is by standard rubygems:
# $ [sudo] gem install jsduck
#
# For more information, please refer to https://github.com/senchalabs/jsduck#getting-it
#
# Docs will be generated in dev/docs/build/ directory.
#

set -e

echo "Building the API document into the 'build/' directory..."
echo ""

# Move to the script directory.
cd $(dirname $0)

jsduck ../../core ../../plugins ../../ckeditor.js -o build \
	--stats \
	--title="CKEditor 4 JavaScript API Documentation" \
	--head-html="<link rel='stylesheet' href='resources/css/ck.css' type='text/css' />" \
	--footer="Copyright © 2003-2012, <a href='http://cksource.com' style='color: #085585'>CKSource</a> - Frederico Knabben. All rights reserved. |
	Generated with <a href='https://github.com/senchalabs/jsduck'>JSDuck</a> 4.0.0." \
	--meta-tags customs.rb \
	--warnings=-no_doc \
	--welcome=welcome.html

echo "Applying customizations:"
echo "	* Copying resources..."
cp -r resources build

echo "	* Copying favicon..."
cp favicon.ico build

echo ""
echo "Finished!"