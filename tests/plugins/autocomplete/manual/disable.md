@bender-tags: 4.10.2, bug, 2162
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete
@bender-include: _helpers/utils.js

## Disabled dropdown

1. Focus the editor.
1. Type `@`.
1. Wait until dropdown show up and immediately type `a`.

## Expected

* During options load dropdown is *disabled*.
* When options are loaded dropdown is again *normal*.

## Unexpected

Dropdown doesn't change despite loading options.
