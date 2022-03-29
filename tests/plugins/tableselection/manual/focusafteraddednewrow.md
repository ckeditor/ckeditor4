@bender-tags: 4.18.1, bug, 4904
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableselection, tab, elementspath, sourcearea

1. Press the right mouse button inside a cell to open the context menu and add a new row.
**Note** Do not change focus after adding a new row.
2. Press `TAB` key.

**Expected**

* The selection and focus of the table cell have moved to the next cell.

**Unexpected**

* The focus is outside the editor.

3. Repeat above steps for different combinations like: adding cells, moving focus backwards etc.
