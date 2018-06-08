@bender-tags: 4.10.0, bug, 1987
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.

## Expected

* Dropdown contains **bolded** names.
* All are prefixed with "item: " string.

## Unexpected

* Names inside dropdown are plain text.
* Names are not prefixed with "item: " string.
