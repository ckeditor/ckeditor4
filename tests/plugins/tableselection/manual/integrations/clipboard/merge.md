@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1833
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath

## Forward paste

1. Select the first row in the first table.
1. Copy it with `ctrl/cmd+c`.
1. Put a collapsed selection in the last position of any row (e.g. `Cell 1.3.4^`).
1. Paste with `ctrl/cmd+v`.

### Expected

Row is inserted after given row.

### Unexpected

Row gets pasted as a new table.

## Backward paste

1. Steps 1, 2 from "Forward paste".
1. Put a collapsed selection in the **first** position of any row (e.g. `^Cell 1.3.1`).
1. Paste with `ctrl/cmd+v`.

### Expected

Row is inserted before given row.

### Unexpected

Row gets pasted as a new table.
