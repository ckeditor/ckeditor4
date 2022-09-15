@bender-tags: 4.20.0, feature, 2008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch, emoji

1. Place cursor on the editable.
2. Type `:bug`.
3. Press enter.

## Expected

Space has been added after the insertion `🐛 ^`.

## Unexpected

Space has not been added after the insertion `🐛^`.
