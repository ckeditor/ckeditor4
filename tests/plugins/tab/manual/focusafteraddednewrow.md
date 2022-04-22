@bender-tags: 4.19.0, bug, 4904
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tab, tabletools, tableselection, elementspath, sourcearea, undo, contextmenu

1. Press the right mouse button inside a cell to open the context menu and add a new row.
**Note** Do not change the focus after adding a new row.
2. Press the `TAB` key.

**Expected**

* The focus of the table cell has moved to the next cell.

**Unexpected**

* The focus is outside the editor.


3. Repeat the above steps for the inline editor and different combinations, like adding cells, moving focus backward, etc.
