@bender-tags: bug, 4.12.0, 2870, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea, list

Paste text from Word with indented lists. You can use example file: [List_indentation.docx](../generated/_fixtures/List_indentation/List_indentation.docx).

## Expected:

- List indentation is preserved by `margin-left` style. Following point is an exception.
- `margin-left` values lower than zero are disallowed, so items with decreased indentation won't the look same as in Word.
- Word list item with default indentation will have `margin-left:8px` when pasted into the editor.

## Unexpected

Additional positive margin is not preserved (`margin-left`). Any element has negative `margin-left` values.
