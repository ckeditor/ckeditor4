@bender-tags: bug, 4.6.0, config, word
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, list, basicstyles, pastefromword, sourcearea, elementspath, newpage

### PFW events

In this test both `pasteFromWord` and `afterPasteFromWord` events are modifying the content pasted to the editor.

1. Create / open word document with a list like:
	```
	* foo
	* bar
	* baz
	```
1. Copy it and paste into the editor.
1. Press "Source" button to see source code.

## Expected

* "foo" gets replaced with `pasteFromWord`
* "bar" gets replaced with `afterPasteFromWord`
* formatting is preserved
