@bender-tags: tc, 4.5.9, 11697
@bender-ui: collapsed
@bender-ckeditor-plugins: find, wysiwygarea, toolbar

1. Open *Replace* dialog.
1. Type "apollo" in *Find what* field.
1. Click *Replace* button.
	* **Expected:** "Apollo" was highlighted inside editor.
1. Check *Match case* checkbox.
1. Click *Replace* button.
	* **Expected** "The specified text was not found." message was displayed.
1. Type "Apollo" in *Find what* field.
1. Click *Replace* button.
	* **Expected:** "Apollo" was highlighted inside editor.
1. Type "Foo" in *Replace with* field.
1. Click *Replace* button.
	* **Expected** Highlighted text changed to "Foo".
