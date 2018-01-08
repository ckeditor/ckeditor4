# Change Log

All notable changes to the A11yFirst project will be documented in this file.

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
