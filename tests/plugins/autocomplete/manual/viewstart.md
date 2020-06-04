@bender-tags: 4.10.0, bug, 1970
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

# Single word

1. Focus the editor.
1. Type `@foo`.

## Expected

View should be placed at the beginning of the word.

## Unexpected

View is placed at the end of the word.

# Splitted word

1. Focus the editor.
1. Type `@foo bar` where both words are in different lines e.g.

```
+-----------------------+
|                       |
|      text start - @foo|
| bar█ - caret position |
|                       |
+-----------------------+
```

## Expected

View should be placed at the beginning of the second word.

## Unexpected

View is placed at the end of the second word.
