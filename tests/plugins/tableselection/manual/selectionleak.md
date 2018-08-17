@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp2283
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, undo, elementspath

1. Select first row in the second table.
1. Press `Backspace`.

### Expected

Row is removed, selection stays inside of the second table.

### Unexpected

Selection is moved to the first table.
