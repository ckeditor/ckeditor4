@bender-tags: 5437, bug, 4.21.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font

1. Select some text in the editor.
1. Open "Font" combo.
1. Select the "Comic Sans MS" font.
1. Reopen the "Font" combo.

	**Expected** The "Comic Sans MS" font is selected.

	**Unexpected** The first item in the combo is selected.
1. Press the <kbd>Down Arrow</kbd>.

	**Expected** Focus moved to the next element but "Comic Sans MS" is still marked as selected (gray background).

	**Unexpected** "Comic Sans MS" is no longer marked.
