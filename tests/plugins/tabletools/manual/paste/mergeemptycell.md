@bender-ui: collapsed
@bender-tags: tc, 18, tp1833
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, clipboard, sourcearea, undo, elementspath

## Forward paste

1. Select the first row in the first table.
1. Copy it with `ctrl/cmd+c`.
1. Put a collapsed selection in the last position of second row (it's an empty cell).
1. Paste with `ctrl/cmd+v`.

### Expected

Row is inserted after given row.

### Unexpected

Row gets pasted as a new table.