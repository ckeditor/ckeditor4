@bender-tags: bug, 4.13.1, 3413
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,contextmenu,clipboard,menubutton

1. Right click any of words in the editor.

	## Expected

	Context menu looks normal, the option is working.

	## Unexpected

	Instead of the option, there is dump of its internal HTML.
2. Open menu button in the toolbar.

	## Expected

	Open menu looks normal, the option are working.

	## Unexpected

	Instead of the option, there is dump of its internal HTML.
