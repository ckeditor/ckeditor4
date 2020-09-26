@bender-tags: feature, 4.16.0, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, image, pagebreak

1. Copy and paste content of the following file into the editor:
[UnsupportedFormats.docx](../generated/_fixtures/ImagesExtraction/UnsupportedFormats/UnsupportedFormats.docx)

## Expected

* Only the last image is rendered correctly.

## Unexpected

* Last image is not rendered correctly.

Note: all images will be pasted, but only the last one is in supported format and will be rendered correctly.
