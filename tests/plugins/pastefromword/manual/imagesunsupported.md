@bender-tags: feature, 4.16.0, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, image, pagebreak

1. Copy and paste content of the following file into the editor:
[UnsupportedFormats.docx](../generated/_fixtures/ImagesExtraction/UnsupportedFormats/UnsupportedFormats.docx)

## Expected

* Only the last image is pasted.

## Unexpected

* Last image is not pasted correctly.

Note: the first two images could be broken, as they are in unsupported format.
