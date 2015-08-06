@bender-ui: collapsed
@bender-tags: tc, 4.5.3, 13388
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize, basicstyles, undo

1. Insert a table.
2. Type few letters in one of its cells.
3. Resize the left column.
4. Resize the whole table.

Expected: There should be 4 undo steps available. One for each action.