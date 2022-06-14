@bender-tags: 4.19.1, bug, 4284
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, tableselection

1. Open console.
2. Select column with a rowspanned cell and cells containing `1` character.
3. Open context menu and choose "Cell" -> "Merge cells" option.

**Expected:** Cells are merged, undo step is created and there is error in the console.

**Unexpected:** Cells are merged, an error is thrown and no undo step is created.
