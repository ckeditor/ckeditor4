# A11yFirst Help

## Overview

This plug-in adds a dialog box to CKEditor explaining:

* How to get started using A11yFirst for CKEditor and why accessibility
  is important

* How to work with the A11yFirst features, as well as a few of the standard
  features included in CKEditor that are important for accessibility

## Help Topics & Subtopics

### Heading / Paragraph

* Menu items
* About headings
* About paragraph formats
* Why headings and paragraph formats are important
* More information

### List

* Working with lists
* About lists
* Why lists are important

### Image

* Accessible Description
* Type of Image
* Text Alternative
* Document includes long description
* Location of long description
* Include an editable caption
* Why image properties are important
* Writing effective text alternative content
* More information

### Character Style

* Working with character styles
* About character styles
* Character styles vs. headings, lists and paragraph formats

### Link

* Display Text
* About links
* Why links are important
* More information

## Developer Notes

### Adding or Removing Help Topics

To modify the help topics contained in this plug-in, the following steps are
required:

* In `plugin.js`, update the `config.a11yFirstHelpTopics` object. The
  sequential order of the properties in this object determines the order of
  the A11yFirst Help menu items and the help dialog menu buttons.

* In `dialogs/a11yfirst-help.js`, update the `contents.children.html` string
  to include the necessary `div` elements for the help topics.

* In the `content/en` subdirectory, add the Markdown files with content for
  the help topics.

* In `content/en/setLang.js`, update the properties of the object passed to
  the `setLang` function to include all of the help topics.

* Update `content/en/build.sh` to include the processing of the Markdown files
  that contain the content for all of the help topics.

### Using the `showdown` converter

A `showdown` extension is defined in `dialogs/a11yfirst-help.js` that allows
URLs such as image `src` values to be independent of the editor installation
path. The extension object is named `basePathExt`, and it is registered with
`showdown` using the name `basePath`.
