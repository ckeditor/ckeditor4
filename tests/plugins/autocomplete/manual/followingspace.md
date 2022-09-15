@bender-tags: 4.20.0, feature, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Place cursor at end of the editors content.
2. Type `@`.
3. Press enter.

## Expected

Space has been added after the insertion `@john ^`.

## Unexpected

Space has not been added after the insertion `@john^`.
