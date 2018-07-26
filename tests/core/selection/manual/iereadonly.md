@bender-tags: bug, 4.10.1, 1632, selection, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, placeholder

1. Open console.
1. Select whole editor content.
1. Press `ctrl`.
1. Repeat 1-2 with `delete` key.

## Expected

No warning or errors inside console.

## Unexpected

Console registered multiple warnings about invalid selection.
