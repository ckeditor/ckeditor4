#!/bin/sh
# Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

# Build CKEditor using the default settings (and build.js)

set -e

echo "CKBuilder - Builds a release version of ckeditor-dev."
echo ""

CKBUILDER_VERSION="1.0b"
CKBUILDER_URL="http://download.cksource.com/CKBuilder/$CKBUILDER_VERSION/ckbuilder.jar"

PROGNAME=$(basename $0)

function error_exit
{
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
	exit 1
}

# Move to the script directory.
cd $(dirname $0)

# Download/update ckbuilder.jar
mkdir -p ckbuilder/$CKBUILDER_VERSION
cd ckbuilder/$CKBUILDER_VERSION
if [ -f ckbuilder.jar ]; then
	echo "Checking/Updating CKBuilder..."
	curl -O -R -z ckbuilder.jar $CKBUILDER_URL || echo "Warning: The attempt to update ckbuilder.jar failed. The existing file will be used."
else
	echo "Downloading CKBuilder..."
	curl -O -R $CKBUILDER_URL || error_exit "It was not possible to download ckbuilder.jar"
fi
cd ../..

# Run the builder.
echo ""
echo "Starting CKBuilder..."

java -jar ckbuilder/$CKBUILDER_VERSION/ckbuilder.jar --build ../../ release --version="4.0 DEV" --build-config build-config.js --overwrite

echo ""
echo "Release created in the \"release\" directory."
