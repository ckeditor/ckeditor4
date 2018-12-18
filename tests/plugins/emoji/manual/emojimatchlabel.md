@bender-tags: 4.12.0, feature, emoji, 2583
@bender-ckeditor-plugins: wysiwygarea, toolbar, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Focus editor.
1. Type `:collision:`

## Expected:

Panel appears with match: `💥 collision`

## Unexpected:

Panel appears with match: `💥 :collision:`
