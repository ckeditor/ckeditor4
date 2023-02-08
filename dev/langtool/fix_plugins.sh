#!/bin/bash
# Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Correct plugin definitions and update lang/availableLangs properties based on available language files

set -e

echo "CKLangTool - corrects CKEditor plugin definitions."
echo ""

. ./_common.sh || exit

# Run the langtool.
echo ""
echo "Starting CKLangTool..."
echo "Fixing 'lang' properties in plugin files..."

for i in "${plugins[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update-plugin ../../plugins/$i
done

echo "Fixing 'availableLangs' properties in plugin files..."

for i in "${plugins_dialogs[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update-plugin --type=dialog ../../plugins/$i
done

echo ""
