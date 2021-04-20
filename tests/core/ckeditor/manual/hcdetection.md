@bender-tags: feature, 4.16.0, 4379
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard, basicstyles, about, stylescombo, format, link, image

**Note**: this test is dedicated for OSes that **DOES** support high contrast mode (Windows mostly). You can see if HC Mode is correctly detected based on test indicator (`HC is on`).

**Note**: This feature is not supported on Google Chrome, Opera, Safari and mobile. See [documentation](https://ckeditor.com/docs/ckeditor4/latest/guide/skin_sdk_hc.html) for details.

1. Enable high contrast mode in your OS.
2. Check the editor.

	## Expected

	Buttons in the UI are replaced by text labels.

	## Unexpected

	Buttons in the UI are displayed with icons.
