@bender-tags: mentions, feature, 4.10.0, 1987
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, mentions

1. Focus the editor.
1. Type `@`.

## Expected

* Dropdown contains **bolded** names.
* All are prefixed with "item: " string.

## Unexpected

* Names inside dropdown are plain text.
* Names are not prefixed with "item: " string.
