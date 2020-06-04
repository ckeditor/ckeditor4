@bender-tags: 4.11.2, bug, 2451, 4.14.1, 4008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, format, list, removeformat

1. Press `numbered list` button.
1. Select `h1` with elements path.
1. Press `remove format` button.

## Expected

Elements path shows:

`body ol li h1`

## Unexpected

Elements path shows:

`body ol`
