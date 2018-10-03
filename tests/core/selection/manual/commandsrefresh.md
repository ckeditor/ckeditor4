@bender-tags: selection, 4.11.0, bug, 2276
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, link, toolbar

Pay attention to `unlink` button state when performing test steps:

1. Set cursor position inside a link.
1. Move cursor position inside a text.
1. Repeat couple of times.

## Expected

`Unlink` button is disabled for a plain text and enabled for a link.

## Unexpected

`Unlink` button changes its status incorrectly.
