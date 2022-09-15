
@bender-tags: 4.20.0, feature, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Place cursor between words so there is existing space before `hello ^ world`.
2. Type `@`.
3. Press enter.

## Expected

Space has not been added after the insertion. Selection has been placed right after existing space `hello @john ^world`.

## Unexpected

Space has been doubled after the insertion `hello @john ^ world` or selection is placed right after inserted text `hello @john^ world`.
