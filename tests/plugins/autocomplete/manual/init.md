@bender-tags: 4.10.0, bug, 2114
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Open console.
1. Focus the editor.
1. Type `@`

## Expected

* No console errors.
* Autocomplete dropdown showed up.

## Unexpected

* Console errors refering to `Autocomplete.attach` function.
* Autocomplete dropdown didn't show up.
