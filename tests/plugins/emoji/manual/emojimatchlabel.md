@bender-tags: 4.14.0, feature, emoji, 2583
@bender-ckeditor-plugins: wysiwygarea, toolbar, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Focus the editor.
1. Type `:smiling_face:`

## Expected:

The emoji suggestion box appears with the match: `☺️ smiling_face`.

## Unexpected:

The emoji suggestion box appears with the match: `☺️ :smiling_face:`.
