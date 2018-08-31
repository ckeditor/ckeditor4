@bender-tags: 4.10.0, feature, tp3560
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.
1. Press `enter`.
1. Repeat 1-2 and press `tab`.

## Expected

Match has been completed for `tab` and `enter` keys.

## Unexpected

Match has not been completed.
