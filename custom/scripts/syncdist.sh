#!/usr/bin/env bash

# This script uses rsync to add the A11yFirst plugins and supporting files
# to the distribution files hierarchy produced by the CKBuilder tool.

# The location of the distribution files is specified as the first argument
# to the script and saved in the DISTPATH variable.

# The location of the source files, which is typically a clone or checkout
# of the a11yfirst branch of the A11yFirst plugins-dev repository, is
# specified herein as the value of the SRC variable.

# Note: You may need to change the value of the SRC variable to match the
# location of your plugins-dev working copy.

# For more information on the  distribution build process, see the
# custom/a11yfirst.js config file.

# The folders, relative to the top-level folder, that are synchronized:

# 1. custom
# 2. plugins/a11ychecker
# 2. plugins/a11yfirsthelp
# 3. plugins/a11yheading
# 4. plugins/a11yimage
# 5. plugins/a11ylink
# 6. plugins/a11ystylescombo
# 7. plugins/balloonpanel/skins/a11yfirst
# 8. skins/a11yfirst

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
  a11ychecker
  a11yfirsthelp
  a11yheading
  a11yimage
  a11ylink
  a11ystylescombo
)

RSYNC="rsync -av --delete --delete-excluded --exclude='.DS_Store'"
COUNT=0

COUNT=$((COUNT + 1))
SRCPATH="$SRC/custom"
CMD="$RSYNC $SRCPATH $DISTPATH"
echo
echo "$COUNT. $SRCPATH"
eval $CMD

PARENT="plugins"
for PLUGIN in "${PLUGINS[@]}"
do
  COUNT=$((COUNT + 1))
  SRCPATH="$SRC/$PARENT/$PLUGIN"
  CMD="$RSYNC $SRCPATH $DISTPATH/$PARENT"
  echo
  echo "$COUNT. $SRCPATH"
  eval $CMD
done

COUNT=$((COUNT + 1))
PARENT="plugins/balloonpanel/skins"
SRCPATH="$SRC/$PARENT/a11yfirst"
CMD="$RSYNC $SRCPATH $DISTPATH/$PARENT"
echo
echo "$COUNT. $SRCPATH"
eval $CMD

COUNT=$((COUNT + 1))
PARENT="skins"
SRCPATH="$SRC/$PARENT/a11yfirst"
CMD="$RSYNC $SRCPATH $DISTPATH/$PARENT"
echo
echo "$COUNT. $SRCPATH"
eval $CMD
