@bender-tags: bug, 4.11.4, 2813
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea

1. Select word `bar`.

1. Press `Insert html` button.

	## Expected

	There is one red border on the left of inserted `div`.

	## Unexpected

	There are two red borders, one on the left and another on the right of inserted `div`.

1. Press `Reset editor` button.

1. Repeat with `insert element` button. Same expected

1. Reset and repeat with `Insert text`.

## Expected

Inserted word `text` replaces selected word inside border.
