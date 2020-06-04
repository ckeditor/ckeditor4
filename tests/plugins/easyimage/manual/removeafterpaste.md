@bender-tags: 4.9.0, bug, 1529
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

1. Drag an image into editor.
2. Wait until image is uploaded.
3. Press `delete/backspace` key.

## Expected

The image has been deleted.

## Unexpected

The image has not been deleted.
