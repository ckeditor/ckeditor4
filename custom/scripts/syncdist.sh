#!/usr/bin/env bash

# This script uses rsync to synchronize (copy or update) the A11yFirst code
# to the file hierarchy of the CKBuilder output (top-level DISTPATH specified
# by the first argument) from the development source files in the A11yFirst
# plugins-dev repository (specified herein as SRC).

# Note: You may need to update the value of the SRC variable to match the
# location of your plugins-dev checkout.

# For more information on the  distribution build process, see the
# custom/a11yfirst.js config file.

# custom
# plugins/a11yfirsthelp
# plugins/a11yformat
# plugins/a11yheading
# plugins/a11ystylescombo
# plugins/balloonpanel/skins/a11yfirst
# skins/a11yfirst

if [ $# -eq 0 ]; then
  echo "Syntax:"
  echo "    $0 <distribution-folder-path>"
  exit 1
fi

DISTPATH=$1
SRC="$HOME/Sites/plugins-dev"

if [ ! -d $DISTPATH ]; then
  echo "Error: $DISTPATH not found"
  exit
fi

PLUGINS=(
  a11yfirsthelp
  a11yformat
  a11yheading
  a11ystylescombo
)

RSYNC="rsync -av --delete-excluded --exclude='.DS_Store'"

FOLDER="custom"
CMD="$RSYNC $SRC/$FOLDER $DISTPATH"
echo
echo $CMD
eval $CMD

FOLDER="plugins"
for PLUGIN in "${PLUGINS[@]}"
do
  CMD="$RSYNC $SRC/$FOLDER/$PLUGIN $DISTPATH/$FOLDER"
  echo
  echo $CMD
  eval $CMD
done

FOLDER="plugins/balloonpanel/skins"
CMD="$RSYNC $SRC/$FOLDER/a11yfirst $DISTPATH/$FOLDER"
echo
echo $CMD
eval $CMD

FOLDER="skins"
CMD="$RSYNC $SRC/$FOLDER/a11yfirst $DISTPATH/$FOLDER"
echo
echo $CMD
eval $CMD
