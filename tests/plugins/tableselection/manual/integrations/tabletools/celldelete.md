@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1892
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, tabletools, sourcearea, undo, elementspath

## `deleteCells` command

Perform steps for each editor.

1. Open console.
2. Select all cells with mouse.
3. Open context menu and choose "Cell"→"Delete Cells".

**Expected:**

* Cells are deleted with the table.
* Undo is enabled.
* There is nothing in console.

**Unexpected:**

* Table is preserved.
* Undo is disabled.
* There is error in console.


---

1. Repeat above procedure, but instead of "Delete Cells" choose "Row"→"Delete Rows".
