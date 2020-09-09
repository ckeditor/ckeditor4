@bender-tags: 4.16.0, feature, 3582
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Place cursor after `2 `.
1. Type `@`.

*Repeat steps above for all 3 editors.*

## Expected

Mention panel should be appeared above cursor.

## Unexpected

Mention panel is not appearing above cursor.
