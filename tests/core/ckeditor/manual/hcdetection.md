@bender-tags: feature, 4.15.2, 4379
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard, basicstyles, about, stylescombo, format, link, image

**Note**: this test is dedicated for OSes that **DOES** support high contrast mode.

1. Enable high contrast mode in your OS.
2. Check the editor.

	## Expected

	Buttons in the UI are replaced by text labels.

	## Unexpected

	Buttons in the UI are displayed with icons.
3. Check the information above the editor.

	## Expected

	It says "HC is on".

	## Unexpected

	It says "HC is off".

