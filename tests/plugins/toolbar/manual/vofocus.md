@bender-tags: 4.19.0, bug, 4855
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, language, font

**Note** the test is intended to be run with VoiceOver on iOS.

1. Move the focus to the editor's toolbar.

	**Expected** The focus remains on the first button inside the toolbar.

	**Unexpected** The focus is moved to the editable.
1. Check the focusability of other buttons and combos inside the toolbar.
