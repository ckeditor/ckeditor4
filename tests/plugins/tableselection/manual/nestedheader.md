@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, elementspath

**Procedure:**

1. Start selecting in cell with "Start here…".
2. End selection in cell with "…and go here".

**Expected result:**

Only nested table is selected

**Unexpected result:**

The whole "I shouldn't be selected" cell is selected.

3. Clear selection (e.g. clicking outside the table).
4. Try to select part of the text in nested table.

**Expected result:**

Selection is visible.

**Unexpected result:**

Selection is invisible.
