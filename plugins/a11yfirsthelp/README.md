# A11yFirst Help

## Overview

This plug-in adds a dialog box to CKEditor explaining:

* How to get started using A11yFirst for CKEditor and why accessibility
  is important

* How to work with the A11yFirst features, as well as a few of the standard
  features included in CKEditor that are important for accessibility

## Developer Notes

To modify the help topics contained in this plug-in, the following steps are
required:

* In `plugin.js`, update the `config.a11yFirstHelpTopics` object. The
  sequence order of the properties in this object determine the ordering of
  the A11yFirst Help menu items and the help dialog menu buttons.

* In `dialogs/a11yfirst-help.js`, update the `contents.children.html` string
  to include the necessary `div` elements for the help topics.

* In `content/en/setLang.js`, update the properties of the object passed to
  the `setLang` function.

* Update `content/en/build.sh` to include the processing of the markdown files
  that contain the content for all of the help topics.
