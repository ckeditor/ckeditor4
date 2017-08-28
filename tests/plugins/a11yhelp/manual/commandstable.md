@bender-tags: manual, 456, 4.8.0, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,a11yhelp

**Perform below steps in both editors.**

1. Focus editor.
1. Press `Ctrl/Cmd + /`.

**Expected:**
* First editor - Table should contain at least 2 keystrokes `Alt + 0` amd `Ctrl/Cmd + Forward Slash`.
* Second editor - Table should contains 3 new keystrokes:
  - `Alt + Shift + A`.
  - `Alt + Shift + X`, with text 'This is alternative keystroke description'.
  - `Alt + Shift + Z`, with modified label ('This is modified label.') and modified key description ('This is modified key description.').

**Unexpected:** Mentioned keystrokes are not displayed in accessibility dialog.
