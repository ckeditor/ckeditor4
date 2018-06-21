# Change Log

All notable changes to the A11yFirst project will be documented in this file.

## v0.9.0 — 21 Jun 2018

### Updates

* Reorganize A11yFirst Help topics, which now consist of:
  * Heading / Paragraph
  * List
  * Image
  * Character Style
  * Link
  * Getting Started

* Display A11yFirst version number at the bottom left of the help dialog.

* Update some of the Help topic subsection headings for better consistency.

* Modify the way that help topic content is processed to make it easier to
  add and remove topics.

* Add a `showdown` extension called `basePath` to allow URLs for help content
  assets such as images to be independent of CKEditor installation location.

* Tweak the labels for Alignment choices in the Image Properties dialog.

## v0.8.0 — 16 May 2018

### Updates

* Add new `a11yimage` plugin, which is activated by the Image toolbar button
  * Requires `alt` text for Simple and Complex images
  * Prompts for location of long description for Complex images
  * Based on the `image2` plugin with image caption feature

* Add A11yFirst Help topic: Image

## v0.7.2 – 22 Mar 2018

### Updates

* Add `Display Text` validation for `Link type` option `Link to anchor in the text`

* Change `Link type` widget in Link dialog from `select` to `radio` to make the
  three options always visible; change order of the type options

* Update `Heading / Paragraph` menu item labels for paragraph formats:
  * `Computer code` to `Preformatted text`
  * `Address` to `Address line`

* Update Heading / Paragraph content in A11yFirst Help with new labels and expanded
  description of `Address line`

* Add `codesnippet` plugin and toolbar button

## v0.7.1 – 12 Mar 2018

### Updates

* Update logic in the Link plugin, including new messaging

* Update Link content in A11yFirst Help

* Rename item in `Heading / Paragraph` from `Preformatted` to `Computer code`

* Add `DISTRIBUTION.md` file with instructions for creating new distribution

## v0.7.0 – 19 Feb 2018

### Updates

* Combine the `Heading` and `Paragraph Format` menus into a new menu called
  `Heading / Paragraph`, which is the updated `a11yheading` plugin.

* Updates to “Getting Started with A11yFirst” in testdrive.html

* Add new plugin named `a11ylink` with warning dialogs for link `Display Text`
  field

## v0.6.1 – 31 Jan 2018

### Updates

* Add testdrive.html, which includes text entitled “Getting Started with A11yFirst”

## v0.6.0 — 5 Jan 2018

### Updates

* Rename `Heading` menu items to be more descriptive of how each should be applied
  and omit the use of `Level`, which seemed to confuse some users

  * `H1 - Document title`
  * `H2 - Section title`
  * `H3 - Subsection title`
  * `H4 - Subsection title`
  * `P - Revert to paragraph`

* Move `Link` buttons (set of 3) from first to second row of toolbar near the end

* Rename `Block Format` menu button to `Paragraph Format` and move to position just
  after List buttons

* Rename `Paragraph Format` menu items to eliminate redundancy

  * `Normal` (was `Normal text`)
  * `Preformatted` (was `Preformatted text`)

* Move `Show Blocks` button to position just before `A11yFirst Help`

* Move `A11y Checker` button to end of second row

* Rename `Inline Style` menu button to `Character Style`

* Move `Remove Format (Tx)` button from before to just after `Character Style`

* Update `A11yFirst Help` and `a11yfirst.html` content to sync with labeling updates

### Fixes

* Include the `justify` plugin in the list of plugins in `config.js`, which had been
  inadvertently omitted from the CKBuilder process (not included by default in Basic
  or Standard preset)

* Add the `Justify` button after the previously configured three (Align Left, Center
  and Right) buttons
