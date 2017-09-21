@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1723
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, link, sourcearea, undo, elementspath

## `link` integration

Perform steps for each editor.

1. Select multiple cells, e.g. 1x3 selection starting at "Cell 1.1.1" and ending at "Cell 1.3.1".
1. Press Link button.
1. Type `foobar.com` as URL.
1. Click OK.

**Expected:** Link is applied to every selected cell.

**Unexpected:** Link is applied only to the first cell.

Keyboard: Use test case 1, but instead clicking Link button use `ctrl/cmd+l` hotkey.
