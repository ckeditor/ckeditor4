@bender-tags: 4.16.0, bug, 4372
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, autogrow, basicstyles, toolbar, resize


1. Focus the editor.
2. Press `enter` multiple times to force the editor to resize.

## Expected
Editor width is not changing during auto-resize.

## Unexpected
With each vertical resize editor is shrinking for about 2 pixels.
