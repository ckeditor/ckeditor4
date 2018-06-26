@bender-tags: 4.10.1, bug, 2158
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.
1. Move mouse over the last dropdown item.
1. Press `enter`.

## Expected

* Dropdown starting item focus didn't change when moving mouse over dropdown items.
* First dropdown item is inserted on `enter` key.

## Unexpedted

* Focus changes when moving mouse over dropdown items.
* The last selected item is inserted on `enter` key.
