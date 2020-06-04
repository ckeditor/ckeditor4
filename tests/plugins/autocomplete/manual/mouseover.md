@bender-tags: 4.10.0, bug, 2031, 2187
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Open a console.
1. Focus the editor.
1. Type `@` character to open autocomplete with default template.
1. Move mouse over the last dropdown item.
1. Press enter.
1. Repeat with `#` character to open autocomplete with custom template.


## Expected

* No errors inside console.
* Selection changes when moving mouse over dropdown items.
* The last selected item is inserted on `enter` key.

## Unexpected

* Any errors inside console.
* First item is preselected regardless of mouse hover.
* The first item is inserted on `enter` key.
