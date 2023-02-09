@bender-tags: 4.20.2, bug, 4829
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, tab, table, undo, floatingspace, sourcearea, basicstyles

**Note**: If you change the selection when adding text to the table cells, the undo/redo steps may work differently due to updating selection snapshots.

1. Fill all empty cells in the table with some text.
2. Press undo button at the end of the undo stack.

**Expected**: Text from each cell separately is undone in the reverse order of adding a text.

3. Press the redo button at the end of the redo stack.

**Expected**: Text from each cell separately is redone back to the original state.
