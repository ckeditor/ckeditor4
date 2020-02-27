@bender-ui: collapsed
@bender-tags: placeholdertext, feature, 4.15.0
@bender-ckeditor-plugins: wysiwygarea, placeholdertext, toolbar, undo, basicstyles, clipboard, easyimage

## Procedure

1. Open console

	### Expected

	There are no errors.

	Note: error connected with incorrect upload URL for Easy Image can be present.

	### Unexpected

	There is error in the console: `Uncaught TypeError: Cannot read property 'data-cke-placeholdertext' of undefined`.
2. Look at the image

	### Expected

	Caption is visible.

	### Unexpected

	Caption is not visible.
