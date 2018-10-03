@bender-tags: 4.11.0, bug, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the editor.
1. Type `@` to start autocompletion.
1. Accept the first entry.
1. Type ` and ` (note spaces).
1. Type `@` to start another autocompletion.
1. Accept the first entry.

## Expected result
Text between the autocompleted values should not be bolded.

## Actual result
The text is bolded.
