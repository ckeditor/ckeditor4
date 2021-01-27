@bender-tags: 4.16.0, feature, 3582
@bender-ckeditor-plugins: sourcearea, wysiwygarea, toolbar, autocomplete, textmatch, resize
@bender-ui: collapsed
@bender-include: _helpers/utils.js

1. Place caret in the editor as close to the bottom as possible.
1. Scroll the window down to only see the line where you put the caret.
1. Type `@`.

  ### Expected:

  Autocomplete panel should appear below the caret.

  ### Unexpected:

  Autocomplete panel appeared above the caret.

1. Use editor resizer and scroll to check if panel always appears fully within the browser viewport.
