@bender-tags: bug, bug, 4.7.1, 534, word
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, sourcearea, elementspath, newpage, list

## Pasting list

1. Open [`tests/plugins/pastefromword/generated/_fixtures/Unordered_list/Unordered_list.docx`](https://github.com/ckeditor/ckeditor4/blob/1fb8232af13c4d536277aaff2f9a9628c3a8bbf2/tests/plugins/pastefromword/generated/_fixtures/Unordered_list/Unordered_list.docx) file in Word.
1. Select whole content.
1. Copy to clipboard.
1. Focus CKEditor.
1. Paste.

### Expected

List gets pasted as a `ul` list (you can see it on elements path, or in source view).

### Unexpected

List gets pasted as set of paragraphs / error is thrown in the console.
