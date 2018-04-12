@bender-ui: collapsed
@bender-tags: 1489, 4.10.0, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

1. Focus the editor.
1. Select the first row in table.
1. Press `backspace` key.
1. Repeat 1-3 with `delete` key.
1. Repeat 1-3 with `a`, `k` keys (random key validation).

## Expected

Selected row didn't change.

## Unexpected

Selected row has been deleted.
