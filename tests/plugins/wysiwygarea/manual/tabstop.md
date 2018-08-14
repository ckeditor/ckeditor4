@bender-ui: collapsed
@bender-tags: tableselection, bug, 1887, 4.11.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

1. Select some text in the first editor.
2. Press <kbd>Tab</kbd>.

	### Expected

	* Focus is moved to "I'm a focus trap" button after the editor.
	* Selection stays the same inside the editor.

3. Press <kbd>Shift + Tab</kbd>.

	### Expected

	* Focus is moved back to the editor.
	* Selection stays the same.

	### Unexpected

	* Selection is removed.

4. Press <kbd>Shift + Tab</kbd> once more.

	### Expected

	* Focus is moved to "I'm a focus trap" button before the editor.
	* Selection stays the same inside the editor.

	### Unexpected

	* Selection is removed.
	* Focus is moved from editor content to editor's frame.

5. Press <kbd>Tab</kbd>.

	### Expected

	* Focus is moved back to the editor.
	* Selection stays the same inside the editor.

	### Unexpected

	* Selection is removed.

6. Repeat the whole procedure for the second editor.
