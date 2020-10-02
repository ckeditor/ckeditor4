@bender-tags: feature, 4.16.0, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, image, pagebreak, autogrow

1. Open console.
2. Copy and paste content of the following file into the editor:
[UnsupportedFormats.docx](../generated/_fixtures/ImagesExtraction/UnsupportedFormats/UnsupportedFormats.docx)

## Expected

* Only the last image is rendered correctly.
* There are two errors in the console connected with unsupported image formats.

## Unexpected

* Last image is not rendered correctly.
* There are no errors in the console.

Note: all images will be pasted, but only the last one is in supported format and will be rendered correctly.
