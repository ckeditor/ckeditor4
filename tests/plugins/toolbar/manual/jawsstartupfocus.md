@bender-tags: 4.19.0, bug, 4855
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, language, font

**Note** the test is intended to be run with JAWS.

1. Reload the page.

	**Expected** The screen reader's focus is not moved to the editor's toolbar.

	**Unexpected** Screen reader starts announcing the editor's toolbar contents.
