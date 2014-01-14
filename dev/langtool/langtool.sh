#!/bin/bash
# Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or http://ckeditor.com/license

# Fix language files by adding missing entries from en.js to other language files.

set -e

echo "CKLangTool - corrects CKEditor language files."
echo ""

. ./_common.sh || exit

# Run the langtool.
echo ""
echo "Starting CKLangTool..."

java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update ../../lang

for i in "${plugins[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update ../../plugins/$i/lang
done

for i in "${plugins_dialogs[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update ../../plugins/$i/dialogs/lang
done

echo ""
