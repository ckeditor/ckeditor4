@bender-tags: feature, 4.15.2, 4379
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard, basicstyles, about, stylescombo, format, link, image

1. Enable high contrast mode in your OS.
2. Check the editor.

	## Expected

	* If the current OS and browser support high contrast: Buttons in the UI are replaced by text labels.
	* If the current OS and browser don't support high contrast: Buttons in the UI are displayed with icons.

	## Unexpected

	* If the current OS and browser support high contrast: Buttons in the UI are displayed with icons.
	* If the current OS and browser don't support high contrast: Buttons in the UI are replaced by text labels.

