@bender-tags: widget, faeture, 4.16.0, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

## Insert a paragraph above or behind a widget

Test should be performed with browser dev tools opened.

### Scenario 1: `INSERT PARAGRAPH ABOVE A WIDGET`

1. Focus widget in editor.
2. Press `SHIFT + UP ARROW`.

**Expected:** A paragraph should appear above the widget. No errors must occur. Check the result using the source command. Undo button should be available.

### Scenario 2: `INSERT PARAGRAPH BELOW A WIDGET`

1. Focus widget in editor.
2. Press `SHIFT + DOWN ARROW`.

**Expected:** A paragraph should appear below the widget. No errors must occur. Check the result using the source command. Undo button should be available.