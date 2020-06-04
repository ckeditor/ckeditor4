@bender-tags: bug, 4.7.0, trac17001
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, pastefromword, flash

1. Open [`tests/plugins/pastefromword/generated/_fixtures/Object/Object.docx`](https://github.com/ckeditor/ckeditor4/blob/major/tests/plugins/pastefromword/generated/_fixtures/Object/Object.docx) in Word.
1. Copy its content.
1. Paste into the editor.

## Expected

No flash objects are pasted.

## Unexpected

Flash objects gets pasted.
