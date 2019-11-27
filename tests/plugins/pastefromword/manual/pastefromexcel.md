@bender-tags: bug, 4.7.0, trac16961
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, pastefromword, elementspath, tabletools, justify

1. Open some excel file with _basic formatting_.
	As an example you can use [`tests/plugins/pastefromword/generated/_fixtures/Table_text_attributes/Mixed/Mixed.xlsx`](https://github.com/ckeditor/ckeditor4/blob/major/tests/plugins/pastefromword/generated/_fixtures/Table_text_attributes/Mixed/Mixed.xlsx).
1. Copy its content.
1. Paste into the editor.

## Expected

Formatting is preserved.

## Remarks

Basic formatting includes:

* font color, weight, decoration, size, alignment
* cell background, width, height, (horizontal/vertical) alignment
