@bender-ui: collapsed
@bender-tags: 1489, 4.9.0, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, sourcearea, undo, elementspath

1. Focus the editor.
1. Select the first row in table.
3. Press `backspace` key.
4. Repeat 1-3 with `delete` key.

## Expected

Selected row didn't change.

## Unexpected

Selected row has been deleted.
