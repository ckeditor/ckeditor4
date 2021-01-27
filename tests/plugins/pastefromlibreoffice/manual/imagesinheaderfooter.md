@bender-tags: feature, 4.16.0, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromlibreoffice, image, pagebreak, autogrow

1. Copy and paste content of the following file into the editor:
[InHeaderFooterComplex.odt](../generated/_fixtures/ImagesExtraction/InHeaderFooterComplex/InHeaderFooterComplex.odt)

## Expected

* All images from the main content (not headers and footers) are pasted alongside other content

## Unexpected

* Images from the main content are not pasted correctly.
* Images from headers/footers are pasted.
