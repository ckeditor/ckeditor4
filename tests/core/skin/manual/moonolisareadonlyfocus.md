@bender-tags: 4.19.0, feature, 5145
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, floatingspace, elementspath
@bender-ui: collapsed

Note: focus indicator in the `iframe`-based editor is not visible in Firefox due to [its bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1483828).

1. Focus the editor.

	**Expected** There is visible outline around the editable area.

	**Unexpected** There is no visible outline around the editable area.
1. Press the <kbd>Alt</kbd>+<kbd>F10</kbd> shortcut to focus the toolbar.

	**Expected** The outline is still visible.
1. Blur the editor.

	**Expected** The outline disappears.
1. Repeat the procedure for all editors.
