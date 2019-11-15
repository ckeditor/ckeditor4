@bender-tags: 4.14.0, feature, emoji, 2583
@bender-ckeditor-plugins: wysiwygarea, toolbar, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Focus editor.
1. Type `:smiling_face:`

## Expected:

Emoji suggestion box appears with match: `☺️ smiling_face`

## Unexpected:

Emoji suggestion box appears with match: `☺️ :smiling_face:`
