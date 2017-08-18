@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table

1. Open the table dialog.
1. Focus the "Summary" input.
1. Press ALT + SHIFT + END (on keyboards without the END button: FN + ALT + SHIFT + RIGHT ARROW).
1. Expected: direction of the text changed to RTL. You can verify this by:
	* Inspecting the input (should have `'dir'` attribute set to `'rtl'`).
	* Typing or using arrow keys (something should be revesrsed - behavior depends on the browser).
1. Press ALT + SHIFT + HOME.
1. Expected: direction of the text changed to LTR.
