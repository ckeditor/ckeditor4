@bender-tags: 4.10.0, feature, 1751
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch, floatingspace
@bender-include: ../_helpers/utils.js

# Kama skin

1. Put the selection at the end of the first editor.
1. Type "@" to trigger autocompletion.

## Expected

List of suggestions appear right under the caret, and is styled.

## Unexpected

List is not visible, or appended to the document as a regular HTML list.
