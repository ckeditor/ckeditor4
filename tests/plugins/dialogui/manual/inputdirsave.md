@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, contextmenu

1. Open the table dialog.
1. Focus the "Summary" input.
1. Press ALT + SHIFT + END (on keyboards without the END button: FN + ALT + SHIFT + RIGHT ARROW).
1. Expected: direction of the "Summary" input should be RTL. You can verify this by:
	* Inspecting the input (should have `'dir'` attribute set to `'rtl'`).
	* Typing or using arrow keys (something should be revesrsed - behavior depends on the browser).
1. Type some text.
1. Commit the dialog. A table should be inserted.
1. Click the table button in the toolbar.
1. Expected: direction of the "Summary" input should be LTR.
1. Close the dialog (without committing).
1. Open the table dialog for the first table.
1. Expected: direction of the "Summary" input should be RTL.