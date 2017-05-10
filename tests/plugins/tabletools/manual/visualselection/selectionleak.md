@bender-ui: collapsed
@bender-tags: tc, 18, 4.7.0, tp2283
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, undo, tabletools, elementspath

1. Select first row in the second table.
1. Press `Backspace`.

### Expected

Row is removed, selection stays inside of the second table.

### Unexpected

Selection is moved to the first table.
