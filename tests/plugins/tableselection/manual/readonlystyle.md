@bender-ui: collapsed
@bender-tags: tableselection, bug, 1887, 4.11.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection

1. Select some table cells.

	### Expected

	* Selected cells have blue background.

	### Unexpected

	* Selected cells have gray background.

2. Focus out of the editor, using <kbd>Tab</kbd> (focus should be moved to "I'm a focus trap" button).

	### Expected

	* Selected cells have gray background.

	### Unexpected

	* Selected cells have blue background.

3. Focus the editor, using <kbd>Shift + Tab</kbd>.

	### Expected

	* Selected cells have blue background.

	### Unexpected

	* Selected cells have gray background.

4. Repeat steps 2 & 3, but with reversed tab order (focus out using <kbd>Shift + Tab</kbd>, focus in using <kbd>Tab</kbd>).
