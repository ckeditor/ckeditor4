@bender-tags: bug, 4.19.0, 2445
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, basicstyles, floatingspace

**Note** This test is intended to be used with a screen reader.

1. Focus the editor.

	**Expected** The editor is announced as the generic text input.

	**Unexpected** The editor's name is announced ("Editor foo").
1. Press <kbd>Alt</kbd>+<kbd>F10</kbd> to focus the toolbar.

	**Expected** The toolbar is correctly announced (first button info followed by "Rich Text Editor foo").

	**Unexpected** The info about the editor is not included in the announcement.
