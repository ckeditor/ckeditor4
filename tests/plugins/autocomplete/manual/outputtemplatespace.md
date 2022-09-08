@bender-tags: 4.20.0, bug, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Press italic style button.
1. Type `@` to start autocompletion.
1. Accept the first entry.
1. Type ` and ` (note spaces).
1. Type `@` to start another autocompletion.
1. Accept the first entry.

## Expected result

Text between the autocompleted values should not be bolded, although it should remain italic.

## Actual result

The text is bolded or it's not keeping italic style.
