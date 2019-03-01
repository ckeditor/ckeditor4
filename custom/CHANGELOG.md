# Change Log

All notable changes to the A11yFirst project will be documented in this file.

## v1.1.1 – 1 Mar 2019

### Updates

* Add Usability Test Pages
  * New test pages were created that make it easier for usability test
    subjects to:
    * Find the introductory material they are asked to read
    * Find the images they are asked to add to documents
    * Copy the image URLs to the clipboard so that they can be pasted into
      the URL field in the image dialog
  * The new pages also feature a consistent look and feel by incorporating
    stylized headers and footers and a tab interface.

* Move development test pages and images to `custom/archive` folder

* Update A11yImage dialog
  * Make the Help link focusable
  * Fix problems with tab order and keyboard navigation

* Update A11yFirst Help: About A11yFirst
  * Update Contributors section
  * Add Sponsors section

## v1.1.0 – 25 Feb 2019

### Updates

* A11yImage plugin: design modifications
  * Remove the `Image Type` fieldset and its constituent radio buttons. We are
    no longer requiring a selection between `Informative` and `Decorative` as
    it is felt that adding decorative images is an atypical use case.
  * Remove the fieldset grouping that was labeled `Accessible Descriptions`,
    and briefly `Text Alternatives`, but keep it constituent elements.
  * Rename the `Short description` label to `Alternative text` to align with
    the terminology used in standards specifications and much of the a11y
    community's articles, as well as the `alt` attribute in HTML. Also, as
    part of the new label, append `(spoken by screen reader)`.
  * Add a checkbox just below the `Alternative text` text field with label
    `Image does not require alternative text`.
  * Replace the long description checkbox and radio button fieldset with a
    select box with label `Is there an adjacent detailed description of the
    image in the document?`.
  * Remove the fieldset labeled `Caption` that enclosed the caption checkbox
    and change its label to 'Insert a caption text box below the image'.
  * Update tooltip text for text alternative, long description and caption.

* A11yFirst Help
  * Update the Image content to sync with new terminology and messaging in
    the Image plugin.
  * Add a test for each plugin such that when Help is invoked, a test is run
    to determine whether the `A11yFirst Help` plugin is installed. If it is
    not installed, an alert box message is displayed.

* Reorganize CSS to eliminate the need for a separate `a11yfirst` skin
  * What had been an insoluble problem of applying CSS styles to menubuttons
    by methods other than relying on a separate a11yfirst skin, was resolved
    by utilizing code in `core/skin.js`. The problem involved applying CSS
    styles to the contents of an iframe, which is now solved in a11yheading.
  * There is now a global CSS file named `a11yfirst.css` that should/must be
    loaded by each HTML page that hosts an A11yFirst editor instance.
  * Also from `core/skin.js`, we use the appendStyleSheet method of CKEDITOR
    to load/apply CSS styles that are a11yfirst-plugin-specific (e.g. in
    a11yfirsthelp and a11yheading)
  * The main configuration file for a11yfirst, `config.js`, now loads the
    default `moono-lisa` skin.
  * This removes barriers that were making it logistically difficult to
    submit the A11yFirst plugins to the CKSource Add-ons repository.
  * Another result of these modifications: it is no longer necessary to
    maintain a separate a11yfirst folder within the balloonpanel plugin.

* A11yHeading plugin
  * Update the override.js script that modifies the behavior of toolbar buttons
    with text labels by utilizing changes made in CKEditor 4.11
  * The default behavior prior to version 4.11 appended the string '(Selected)'
    to indicate which menu item was selected, which we show within the menu
    using a checkmark
  * A CKSource update to the setState method for the button widget, defined
    in plugins/button/plugin.js fixes this problem
  * The `plugin.js` file contains a `compareVersions` function that is used
    to conditionally load the `override.js` script for versions of CKEditor
    earlier than 4.11.

## v1.0.3 – 5 Dec 2018

### Updates

* `custom/testdrive.html`: Replace ‘Getting Started with A11yFirst’ with new
  summary/details section entitled ‘Inclusive Authoring: Creating Accessible
  Documents’

* `custom/gitlab` folder: Add GitLab files, used for publishing the mirrored
  GitHub `a11yfirst/distribution` repository at `https://a11yfirst.gitlab.io`

* `custom/scripts/syncdist.sh`: Add sync of `custom/gitlab` files to root
  folder of `distribution` repository

### Fixes

* `a11yimage` dialog: Fix line wrapping in summary/details messages ‘How to
  choose the image type?’ and ‘When is a long description required?’

## v1.0.2 – 28 Nov 2018

### Updates

* Design modifications of Image plugin dialog
  * Add summary/details box underneath ‘Image Type’ radio buttons with summary
    label ‘How to choose the image type?’
  * Revert ‘Text Alternatives’ label to ‘Accessible Descriptions’
  * Replace label text ‘A long description is included in the document’
    with ‘Long description required within the document’
  * Update the tooltip for the ‘Long description required’ label
  * Add summary/details box underneath ‘Long description required’ label with
    summary label ‘When is a long description required?’
  * Change link text in ‘Accessible Descriptions’ from ‘More information on
    text alternatives’ to ‘More information on short and long descriptions’
  * Move ‘Insert caption’ checkbox into a fieldset labeled ‘Caption’ for
    improved labeling and findability of dialog elements
  * Update Image Help to sync with updated labeling in the Image dialog

## v1.0.1 – 26 Oct 2018

### Updates

* Redesign Image plugin dialog with simpler, sparser layout and labeling
  * Remove messaging underneath `Image Type` radio buttons
  * Replace `Accessible Descriptions` label with `Text Alternatives`
  * Remove `Tips` button next to `Short description` textbox
  * Replace checkbox label `Complex image (requires long description)` with
    `A long description is included in the document`
  * Rename link that was labeled `More information on describing a complex image`
    to `More information on text alternatives for images` and move to just below
    the `Location of long description` fieldset
  * Rename checkbox label `Add an editable caption below the image` to `Insert an
    editable caption below the image`
  * Remove the message that appeared when caption checkbox is selected
  * Modify tooltip messages for `Image Type` radio buttons
  * Add tooltips to all interactive elements in `Text Alternatives` fieldset,
    all of which reference screen reader behaviors
  * Add or modify tooltips for `Insert caption` and `URL` fields

* Significantly reorganize and simplify Image help to sync with labeling
  modifications in the Image dialog

* Add `About A11yFirst` topic to help system
  * Include list of contributors to the project

* Change the display location of A11yFirst version to `About A11yFirst`

## v1.0.0 – 5 Sep 2018

### Updates

* Modify Image plugin design, labeling and messaging:
  * Change `Image Type` options to `Informative` and `Decorative`
  * Replace `Text alternative` label with `Short description`
  * Add `Tips` button next to `Short description` textbox
  * Add `More information on describing a complex image` link
  * Various tweaks to other labels and warning dialog messages

* Update Image help topic to support with new design

* Replace Accessibility Checker with our own modified version that addresses
  problems with rules for blockquote and image title attribute.

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
