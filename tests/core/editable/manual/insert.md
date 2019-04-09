@bender-tags: bug, 4.12.0, 2813
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea

## For each insert button

1. After each case use `reset editor` button.

1. Select word `bar`.

1. Press button.

## Expected
- `Insert text` button: Inserted word `text` replaces selected word inside border.
- Any other button : there is one red border on the left of inserted `div`.

## Unexpected
- There are two red borders, one on the left and another on the right of inserted content.
