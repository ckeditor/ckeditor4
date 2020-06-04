@bender-tags: 4.11.3, bug, emoji, 2527
@bender-ckeditor-plugins: wysiwygarea, sourcearea, emoji
@bender-ui: collapsed

## For both editors:

1. Place caret in editor.
2. Use autocomplete to insert emoji, start typing ( `:smil` ).
### Expected:
Emoji started from `:smil` will be displayed first in results.
### Unexpected:
Emoji autocomplete results are sorted alphabetically.
