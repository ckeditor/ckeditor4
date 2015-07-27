@bender-tags: 4.5.2, tc, 13142
@bender-ui: collapsed
@bender-ckeditor-plugins: format, stylescombo, toolbar, wysiwygarea, undo

----

For each editor instance:

1. Type some multiline text.
2. Select it using Ctrl+A.
3. Press backspace or delete.

**Expected result:** The editable should contain only elements typical for their respective enter modes.

Notes:

- &lt;p&gt; elements are colored green and &lt;div&gt; elements are colored red.
- You may experience a flashing &lt;div&gt; element in all but the blockless inline editor.
