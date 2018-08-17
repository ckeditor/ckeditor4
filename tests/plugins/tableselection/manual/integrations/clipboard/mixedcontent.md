@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath, image2

**Procedure:**

1. Open console.
2. Select some content from the "Copy from here…" editor (it could be text/image mixed with table cells or only text/image).
3. Copy/cut it.
4. Select some cells from the "…paste here" editor.
5. Paste. Also try tu force pasting as plain text (`Ctrl+Shift+V`).

**Expected result:**

* All content is pasted into the first selected cell.
* All other cells are emptied.
* There are no errors in the console.
* Operation can be undone or redone.
