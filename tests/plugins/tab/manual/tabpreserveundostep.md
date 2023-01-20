@bender-tags: 4.20.1, bug, 4829
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, tab, table, undo, floatingspace

1. Create a standard table.
2. Write some text in a single cell.
3. Jump to the next cell by using `Tab` key.
4. Repeat step 2.
5. Use `undo` button.

**Expected** Text from the last modified cell was removed. There is undo step for each cell.

**Unexpected** There is a single undo step that reverses the entire input from the table.

6. Repeat above steps for each editor.
