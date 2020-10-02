@bender-tags: feature, 4.16.0, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, image, pagebreak, autogrow

1. Open console.
2. Copy and paste content of the following file into the editor:
[DuplicatedImage.docx](../generated/_fixtures/ImagesExtraction/DuplicatedImage/DuplicatedImage.docx)

## Expected

* Both images are rendered correctly
* There are no errors in the console connected with `pastetools`.

## Unexpected

* At least one image is not rendered correctly.
* There are errors in the console.
