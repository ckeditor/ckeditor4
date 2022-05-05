@bender-tags: 4.19.0, feature, 5145
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, floatingspace, elementspath
@bender-ui: collapsed

1. Focus the editor.

	**Expected** There is visible outline around the editable area.

	**Unexpected** There is no visible outline around the editable area.
1. Press the <kbd>Alt</kbd>+<kbd>F10</kbd> shortcut to focus the toolbar.

	**Expected** The outline is still visible.
1. Blur the editor.

	**Expected** The outline disappears.
1. Repeat the procedure for all editors.
