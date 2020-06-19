@bender-ui: collapsed
@bender-tags: editorplaceholder, feature, 4.15.0, 3793
@bender-ckeditor-plugins: wysiwygarea, editorplaceholder, toolbar, undo, basicstyles, clipboard, easyimage

## Procedure

1. Open console

	### Expected

	There are no errors.

	Note: error connected with incorrect upload URL for Easy Image can be present.

	### Unexpected

	There is error in the console: `Uncaught TypeError: Cannot read property 'data-cke-editorplaceholder' of undefined`.
2. Look at the image

	### Expected

	Caption is visible.

	### Unexpected

	Caption is not visible.
