@bender-tags: 4.5.2, tc, 13142
@bender-ui: collapsed
@bender-ckeditor-plugins: format, stylescombo, toolbar, wysiwygarea, undo

----

For each editor instance:

1. Choose one point from the "Test cases" list and type text according to the description.
2. Select it using Ctrl+A.
3. Press backspace / delete / alphanumeric key / enter key or start typing some text.
4. Repeat until all test cases are done.

Test cases:

1. Empty paragraph.
2. Single paragraph with one line of text.
3. Multiple paragraphs with text.

**Expected result:** The editable should contain only elements typical for their respective enter modes.

Notes:

- &lt;p&gt; elements are colored green and &lt;div&gt; elements are colored red.
- You may experience a flashing &lt;div&gt; (Edge) or &lt;p&gt; (IE) element in all but the blockless inline editor.
