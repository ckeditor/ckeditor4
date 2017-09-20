@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1579
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, floatingspace, clipboard, undo

**Procedure #1:**

1. Start selection in table.
2. Move mouse outside the table
3. Release mouse button on text or empty space.

**Expected result:**

Selection from inside the table is preserved.

**Unexpected result:**

Selection is reset or native selection is visible.

**Procedure #2:**

1. After finishing procedure #1, copy selected cells.
2. Select first two cells in the table.
3. Paste.

**Expected result:**

Cells are pasted as expected (replacing existing cells).

**Unexpected result:**

Text, on which mouse button was released, or whole table is pasted into the first selected cell.
