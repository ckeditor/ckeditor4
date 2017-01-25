@bender-ui: collapsed
@bender-tags: tc, 18, tp1892
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, clipboard, sourcearea, undo, elementspath

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

After deleting cells, press any key to type.

**Expected:**

Text is appended to the existing text.

**Unexpected:**

Part of the existing text is replaced.
