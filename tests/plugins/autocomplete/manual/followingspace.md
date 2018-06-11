@bender-tags: 4.10.0, bug, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

# Following space

1. Place cursor at end of the editors content.
1. Type `@`.
1. Press enter.

## Expected

Space has been added after the insertion `@anna ^`.

## Unexpected

Space has not been added after the insertion `@anna^`.

# Existing space

1. Place cursor between words so there is existing space before `hello ^ world`.
2. Type `@`.
1. Press enter.

## Expected

Space has not been added after the insertion. Selection has been placed right after existing space `hello @anna ^world`.

## Unexpected

Space has been doubled after the insertion `hello @anna ^ world` or selection is placed right after inserted text `hello @anna^ world`.
