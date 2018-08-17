@bender-tags: 4.10.0, bug, 2038
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, textmatch, autocomplete

# Phase 1

1. Open console.
1. Focus the editor.
1. Press `Bold` style button.
1. Type `@`.
1. Press `enter`.

Repeat test steps but use mouse instead of `enter` to accept dropdown option.

## Expected

`@foo` has been inserted into editor.

## Unexpected

Any of:

* Dropdown didn't appear.
* `@foo@` has been inserted into editor.
* There are some errors inside console.
