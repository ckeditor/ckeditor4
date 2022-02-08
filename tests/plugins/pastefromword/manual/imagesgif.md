@bender-tags: feature, 4.16.0, 1134, 2800, pastefromword
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromword, image, pagebreak, autogrow, sourcearea

1. Copy and paste content of the following file into the editor:
[AnimatedGif.docx](../generated/_fixtures/ImagesExtraction/AnimatedGif/AnimatedGif.docx)

	## Expected

	* Image is correctly rendered.
	* Image is animated.

	## Unexpected

	* Image is not rendered correctly.
	* Image is not animated.


2. Check `[src]` attribute of pasted image by switching to source mode.

	## Expected

	Image is pasted and transformed into base64.

	## Unexpected

	Image is not pasted or src attribute is blob url.
