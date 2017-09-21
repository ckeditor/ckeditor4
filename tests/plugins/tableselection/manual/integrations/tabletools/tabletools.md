@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, tabletools, sourcearea, undo, autogrow

**Procedure:**

1. Select two or more table cells (or one table cell, in case of "Merge <direction>" features) in the first table.
2. Click the right mouse button.
3. Select one of the options from the context menu.
4. Repeat the same operation in the second table.
5. Check if undo is working correctly.
5. Repeat the whole process for all tabletools features.

**Expected result:**

* The results in both tables are consistent.
