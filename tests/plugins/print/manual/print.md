@bender-ui: collapsed
@bender-tags: 3661, 4.14.0, feature
@bender-ckeditor-plugins: wysiwygarea, print, font, colorbutton, format, clipboard, pagebreak, toolbar, floatingspace, link, image2

## Steps

Repeat these steps for every editor.

1. Click "Preview" button.

	### Expected

	* New browser window with print preview is opened.

	### Unexpected

	* New browser window doesn't open.
	* Content inside the preview is different than the one in the editor. **Note**: preview shows pagebreak element, in all browsers except IE8, as it is not possible to render new page in HTML. However this element should not be visible on printed document.
2. Close preview window and click the "Print" button.

	### Expected

	* Preview window opens and shows native print dialog.

	### Unexpected

	* Preview window doesn't open.
	* Native print dialog doesn't show.
	* Images or styles are missing inside a preview in the native print dialog.
3. Dismiss native print dialog.

	### Expected

	* Preview window closes.

	### Unexpected

	* Preview window stays open.
