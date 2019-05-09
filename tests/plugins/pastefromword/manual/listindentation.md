@bender-tags: bug, 4.12.0, 2870, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, pastefromword, sourcearea, list

Paste text from Word with indented lists. You can use example file: [List_indentation.docx](../generated/_fixtures/List_indentation/List_indentation.docx).

## Expected:

- When list item is indented more than default (to the right in LTR) it's indentation should be preserved as `margin-left` on `<li>`.
- When list item is indented less than default (to the left in LTR) it's indentation shouldn't be preserved, no `margin-left` on `<li>`.

## Unexpected

Text has no indentation.
