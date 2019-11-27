@bender-tags: bug, 4.12.0, 2813
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea, list, table

## For each insert button and for each element

1. After each case use `reset editor` button.

1. Select the word `bar`.

1. Press button.

## Expected

- `Insert text` button: `text` replaces selected word inside the rectangle.

- Any other button: `div` replaces selected word outside the rectangle.

## Unexpected

Clicked button causes the creation of an additional rectangle.

**NOTE:** Because of [#3042](https://github.com/ckeditor/ckeditor4/issues/3042) two nested divs are used for insertion.
