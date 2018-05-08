@bender-tags: 4.10.0, bug, #541
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, table, tabletools, sourcearea, resize, undo, clipboard

----

**Repeat steps for both editors and both tables inside each of them.**

1. Select content between first pair of arrows. It has to start/end outside of a table and has to end/start inside of a table.
2. Press <kbd>Backspace</kbd> or <kbd>Delete</kbd>
3. Now select content between second pair of arrows and repeat step 2.

**Expected:**
	* Selected text will be removed.
	* Text from paragraph might be merged with table content. This behaviour has to be coherent with using regular keys over selection.

**Unexpected:**
	* Table cells are removed
