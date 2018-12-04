@bender-tags: 4.11.2, bug, 2618
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar,stylescombo, format, colorbutton, font, a11yhelp

1. Focus the editor.
2. Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>F10</kbd>.
	### Expected

	Focus is moved to the editor's toolbar.

	### Unexpected

	Nothing happens.

---

1. Focus the editor.
2. Press <kbd>Alt</kbd>+<kbd>0</kbd>
3. Scroll to "Editor Toolbar" section.
	### Expected

	There are two keystrokes listed there: <kbd>Alt</kbd>+<kbd>F10</kbd> and <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>F10</kbd>.

	### Unexpected

	Only one keystroke is listed there.
