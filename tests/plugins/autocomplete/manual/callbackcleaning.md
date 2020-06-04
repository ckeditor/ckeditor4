@bender-tags: 4.10.0, bug, 1984
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.
1. Immediately delete `@` using `backspace`key.
1. Wait 3 seconds.

## Expected

Nothing happened.

## Unexpedted

After 3 seconds dropdown showed up.
