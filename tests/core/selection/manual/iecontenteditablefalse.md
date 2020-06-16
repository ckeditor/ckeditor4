@bender-tags: bug, 4.7.0, trac14407, selection, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, elementspath

## Test scenario

1. There's an empty button at the start of the second row in the toolbar - use it to add a non-editable widget
above the paragraph already present there.
2. Put the caret at the start of the paragraph and press the `up arrow` key.

** Alternatively: **
1. Create the non-editable widget.
2. Make the editor lose focus.
3. Place the cursor over the widget so that its icon is `text` and its upper-left corner is exactly at the dot in "editable."
4. Click to try to place the caret inside the editable or drag the mouse to create a range.

## Expected

The selection is inside the non-editable area, but once you press any key the whole widget gets selected.

## Unexpected

The widget is not selected when you press a key.
