@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1867
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath

**Procedure:**

1. Select a single column (1 column with 2 rows) in the second table.
2. Copy it.
3. Select a single last cell in the first table.
4. Paste.

**Expected result:**

Table behaves like in regular paste, so it expands to two rows, and cells are replaced.

**Unexpected result:**

Two empty cells in a single row are inserted.
