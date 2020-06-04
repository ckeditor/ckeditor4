@bender-tags: 4.10.0, feature, 2030
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.
1. Wait until dropdown appear.
1. Press <kbd>ArrowUp</kbd> key.

## Expected

* Dropdown contains 3 items.
* The last dropdown item is focused.

## Unexpected

* Dropdown contains more than 3 items.
* Dropdown has invalid item focus.
