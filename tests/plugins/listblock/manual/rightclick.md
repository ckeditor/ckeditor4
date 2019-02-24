@bender-ui: collapsed
@bender-tags: 2857, 4.11.4, bug
@bender-ckeditor-plugins: wysiwygarea, stylescombo, toolbar

## Procedure

1. Open console.
2. Open "Styles" combo.
3. Right click any option.

	### Expected result:

	Focus is moved to the clicked option.

	### Unexpected result:

	Clicked style is applied to the editor.
4. Press `Space`/`Enter`.

	### Expected result:

	Focused option is applied to the editor.

	### Unexpected result:

	* Nothing happens.
	* There is error in the console.
