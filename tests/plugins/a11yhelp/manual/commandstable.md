@bender-tags: manual, 456, 4.8.0, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,a11yhelp

Note: Perform below steps in both editors.
----
1. Focus editor.
1. Press `Alt + 0`.
1. Check `Commands table` section.

**Expected:**
* First editor - Table should contain at least one keystroke `Alt + 0`.
* Second editor - Table should contains 3 new keystrokes:
  - `Alt + Shift + A`
  - `Alt + Shift + B`, with description
  - `Alt + Shift + C`, with modified label

**Unexpected:** Mentioned keystrokes are not displayed in accessibility dialog.
