@bender-ui: collapsed
@bender-tags: editorplaceholder, feature, 4.15.0, 3793, 4249
@bender-ckeditor-plugins: wysiwygarea, editorplaceholder, toolbar, undo, basicstyles, clipboard, htmlwriter, list, table, docprops

## Procedure

1. Open the console.
2. Look at the editor.

	### Expected

	Placeholder is visible.

	Note: the editor's content directory is set to RTL.

	### Unexpected

	Placeholder is not visible.
3. Type anything in the editor.

	### Expected

	There is no error in the console.

	### Unexpected

	There is an error in the console.
