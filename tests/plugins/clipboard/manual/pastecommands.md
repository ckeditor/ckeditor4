@bender-ui: collapsed
@bender-tags: 4.7.0, tc, tp2096
@bender-ckeditor-plugins: clipboard, pastetext, pastefromword, wysiwygarea, toolbar, undo, elementspath, clipboard, floatingspace, sourcearea


Have fun with clipboard plugins!

**Things to check:**

* All buttons shows notification (except IE after allowing access to clipboard).
* "Paste from Word" button forces PFW usage.
* "Paste as plain text" button and `Ctrl+Shift+V` forces pasting as plain text.
* In IE: `Ctrl+Shift+V` displays security dialog. If user doesn't allow accessing the clipboard, notification will be shown. In the other case, content will be pasted as plain text.
* Pressing "Paste as plain text" button, then "Paste" button and pasting afterwards should paste HTML content, not plain text. The same goes with "Paste from Word" button and resetting PFW mode.

