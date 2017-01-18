@bender-ui: collapsed
@bender-tags: tc, 18
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, clipboard, sourcearea, undo, elementspath

**Procedure:**

1. Make a selection containing 1x2 selections (1 column with 2 rows) in second table
2. Copy it.
3. Select a single last cell in first table.
4. Paste

**Expected result:**

Table behaves like in regular paste, so it expands to two rows, and cells are replaced.

**Unexpected result:**

Two empty cells in a single row are inserted:
