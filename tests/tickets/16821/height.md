@bender-tags: 4.7.0, bug, trac16821, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, htmlwriter, pastefromword, sourcearea, elementspath

1. Open [`Table_alignment.docx`](https://github.com/ckeditor/ckeditor4/blob/728d73f3bdecdacfb42c761963b281eeaf146544/tests/plugins/pastefromword/generated/_fixtures/Table_alignment/Table_alignment.docx) in Word.
1. Paste it into the editor.
1. Switch to source mode using "Source" button.

## Expected

Inside `td` elements there are **no** `span`s with  CSS `height` property.
