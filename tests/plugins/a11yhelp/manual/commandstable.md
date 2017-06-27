@bender-tags: manual, 456, tc, 4.8.0, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,a11yhelp

1. Focus editor
1. Press `Alt + 0`, there should be section **Commands table**
1. Table should contain at least one keystroke `Alt + 0`
1. Press `Re-create editor`, this will remake editor and add 3 new keystrokes
1. Press `Alt + 0`
1. Table should contains 3 new keystrokes:
  - `Alt + Shift + A`
  - `Alt + Shift + B`, with description
  - `Alt + Shift + C`, with modify label

**Unexpected:** Keystrokes are not displayed in accessibility dialog.
