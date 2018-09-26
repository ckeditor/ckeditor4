@bender-tags: bug, 4.6.0, config, word
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, list, basicstyles, uberpaste, sourcearea, elementspath, newpage

### PFW events

In this test both `uberpaste` and `afteruberpaste` events are modifying the content pasted to the editor.

1. Create / open word document with a list like:
	```
	* foo
	* bar
	* baz
	```
1. Copy it and paste into the editor.
1. Press "Source" button to see source code.

## Expected

* "foo" gets replaced with `uberpaste`
* "bar" gets replaced with `afteruberpaste`
* formatting is preserved
