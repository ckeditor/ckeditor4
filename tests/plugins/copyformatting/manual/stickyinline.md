@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, basicstyles

**Procedure:**

1. Place cursor inside styled part of text.
2. Double click "Copy Formatting" button in the toolbar to switch into "sticky" mode.
3. Click inside or select with mouse other, unstyled part of text.
4. Click inside another unstyled part of text.

**Expected:**

* Sticky mode is not switched off after applying styles.
* Other toolbar buttons have correct state.

**Unexpected:**

* Sticky mode is switched off after applying styles.
* Other toolbar buttons have incorrect state.
