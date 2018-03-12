@bender-tags: 4.10.0, feature, 1763
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, easyimage
@bender-include: ../_helpers/tools.js

1. Drag an image into editor.
2. Wait until image is uploaded.

## Expected

Alert shows up `Invalid token` message.

## Unexpected

Alert shows up `Your image could not be uploaded due to a network error.` message.
