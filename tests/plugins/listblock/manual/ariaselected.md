@bender-tags: 5437, bug, 4.21.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo

1. Select some text in the editor.
1. Open styles combo.
1. Select the "Big" style.
1. Reopen the styles combo.

	**Expected** The "Big" style is selected.

	**Unexpected** The first item in the combo is selected.
1. Press the <kbd>Down Arrow</kbd>.

	**Expected** Focus moved to the next element but "Big" is still marked as selected (gray background).

	**Unexpected** "Big" is no longer marked.
