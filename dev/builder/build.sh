#!/bin/bash
# Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or http://ckeditor.com/license

# Build CKEditor using the default settings (and build.js)

set -e

echo "CKBuilder - Builds a release version of ckeditor-dev."
echo ""

CKBUILDER_VERSION="1.7"
CKBUILDER_URL="http://download.cksource.com/CKBuilder/$CKBUILDER_VERSION/ckbuilder.jar"

PROGNAME=$(basename $0)
MSG_UPDATE_FAILED="Warning: The attempt to update ckbuilder.jar failed. The existing file will be used."
MSG_DOWNLOAD_FAILED="It was not possible to download ckbuilder.jar"

function error_exit
{
	echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
	exit 1
}

function command_exists
{
	command -v "$1" > /dev/null 2>&1;
}

# Move to the script directory.
cd $(dirname $0)

# Download/update ckbuilder.jar
mkdir -p ckbuilder/$CKBUILDER_VERSION
cd ckbuilder/$CKBUILDER_VERSION
if [ -f ckbuilder.jar ]; then
	echo "Checking/Updating CKBuilder..."
	if command_exists curl ; then
	curl -O -R -z ckbuilder.jar $CKBUILDER_URL || echo "$MSG_UPDATE_FAILED"
	else
	wget -N $CKBUILDER_URL || echo "$MSG_UPDATE_FAILED"
	fi
else
	echo "Downloading CKBuilder..."
	if command_exists curl ; then
	curl -O -R $CKBUILDER_URL || error_exit "$MSG_DOWNLOAD_FAILED"
	else
	wget -N $CKBUILDER_URL || error_exit "$MSG_DOWNLOAD_FAILED"
	fi
fi
cd ../..

# Run the builder.
echo ""
echo "Starting CKBuilder..."

java -jar ckbuilder/$CKBUILDER_VERSION/ckbuilder.jar --build ../../ release --version="4.2 DEV" --build-config build-config.js --overwrite "$@"

echo ""
echo "Release created in the \"release\" directory."
