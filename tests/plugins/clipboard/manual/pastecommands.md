@bender-ui: collapsed
@bender-tags: 4.7.0, bug, tp2096
@bender-ckeditor-plugins: clipboard, pastetext, pastefromword, wysiwygarea, toolbar, undo, elementspath, clipboard, floatingspace, sourcearea


Have fun with clipboard plugins! Use buttons in editor!

**Things to check:**

* All buttons shows notification (except IE after allowing access to clipboard).
* "Paste from Word" button forces PFW usage.
* "Paste as plain text" button and `Ctrl+Shift+V` forces pasting as plain text.
* In IE: `Ctrl+Shift+V` displays security dialog. If user doesn't allow accessing the clipboard, notification will be shown. In the other case, content will be pasted as plain text.
* Pressing "Paste as plain text" button, then "Paste" button and pasting afterwards should paste HTML content, not plain text. The same goes with "Paste from Word" button and resetting PFW mode.

**Step by step:**
1. Use buttons in editor to paste.
1. After each paste reset editor.
1. Copy helper text.
1. Paste test using all buttons without access to clipboard.
1. Paste text with shortcut `Ctrl+Shift+V`.
1. Use `Ctrl+V` check if text is paste properly.
1. Use switch buttons "Paste as plaintext" with other pastes, check if last selected past option is valid for `Ctrl+V` shortcut.
