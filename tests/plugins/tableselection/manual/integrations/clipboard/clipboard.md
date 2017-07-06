@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath

**Procedure:**

1. Open console.
2. Select some cells from the "Copy from here…" editor.
3. Copy/cut them.
4. Select some cells from the "…paste here" editor.
5. Paste.

**Expected result:**

* All cells are pasted.
* The table has the same number of cells in all rows.
* There are no errors in the console.
* Operation can be undone or redone.
* The pasted cells are selected.

**Additional things to check in Edge:**

* Copying shouldn't activate "Undo" button.
