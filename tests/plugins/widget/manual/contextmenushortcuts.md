@bender-tags: 4.11.4, bug, 1901, widget, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, contextmenu, placeholder, codesnippet, enterkey, undo

## Keyboard shortcuts for widgets' context menu

Please do each test for both **inline** (first editor) and **block** (second editor) widget.

### Scenario 1: `SHIFT + F10`

1. Focus widget in editor.
1. Press `SHIFT + F10`.

**Expected:** Context menu opens.

### Scenario 2: `CTRL + SHIFT + F10`

1. Focus widget in editor.
1. Press `CTRL + SHIFT + F10`.

**Expected:** Context menu opens.

### Scenario 3: `SHIFT + LEFT`

1. Focus widget in editor.
1. Press `SHIFT + LEFT`.
1. Open console.

**Expected:** There should be no error in console.

### Scenario 4: `SHIFT + ENTER`

1. Focus widget in editor.
1. Press `SHIFT + ENTER` twice.
1. Click `Undo` button.
1. Open console.

**Expected:** New line should not be inserted and console should remain clean.

### Scenario 5: `SHIFT + Tab`

1. Focus widget in editor.
1. Press `SHIFT + TAB`.

**Expected:** Widget should still be focused.
