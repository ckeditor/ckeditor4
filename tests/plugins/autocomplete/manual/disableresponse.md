@bender-tags: 4.10.2, bug, 2162
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete
@bender-include: _helpers/utils.js

## Disabled dropdown

1. Focus the editor.
1. Type `@`.
1. Wait until dropdown show up and immediately type `a`.
1. Press `enter` during dropdown *disabled* state.
1. Repeat 1-4 but instead `enter` click first dropdown option.

## Expected

Option is not inserted during *disabled* dropdown state.

## Unexpected

Option is inserted during *disabled* dropdown state.
