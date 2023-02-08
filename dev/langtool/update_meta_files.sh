#!/bin/bash
# Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Updates meta files, which are used later to export language files to .po (gettext) format.

set -e

echo "CKLangTool - updates meta files."
echo ""

. ./_common.sh || exit

TARGETDIR=meta

if [ ! -d "$TARGETDIR" ]; then
mkdir $TARGETDIR
fi

# Update meta file for core
java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update -c=config -f=meta -m=meta/ckeditor.core/meta.txt ../../lang/ $TARGETDIR/ckeditor.core/

# Update meta files for plugins
for i in "${plugins[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update -c=config -f=meta -m=meta/ckeditor.plugin-$i/meta.txt ../../plugins/$i/lang/ $TARGETDIR/ckeditor.plugin-$i/
done
# Update meta files for language files used by plugins' dialogs
for i in "${plugins_dialogs[@]}"
do
	java -jar cklangtool/$CKLANGTOOL_VERSION/langtool.jar update -c=config -f=meta -m=meta/ckeditor.plugin-$i-dialogs/meta.txt ../../plugins/$i/dialogs/lang/ $TARGETDIR/ckeditor.plugin-$i-dialogs/
done
