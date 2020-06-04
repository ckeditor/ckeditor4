@bender-tags: selection, 4.13.0, bug, 3161, 3175
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, list, undo, div

1. Double click on word `Bar`.

1. Press `insert` button below the editor.

  ## Expected

  No red border over inserted text is visible.

  ## Unexpected

  Red border is visible.

1. Press `reset` button.

1. Start selecting word `Foo` by mouse from the left.

1. Release mouse over the bullet of sub list.

1. Press `insert` button.

## Expected

No red border over inserted text is visible.

## Unexpected

Red border is visible.
