@bender-tags: 4.10.0, bug, 2031
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@`.
1. Move mouse over the last dropdown item.
1. Press enter.


## Expected

Selection changes when moving mouse over dropdown items. The last selected item is inserted on `enter` key.

## Unexpected

First item is preselected regardless of mouse hover. The first item is inserted on `enter` key.
