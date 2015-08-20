@bender-tags: 4.5.4, tc, 13142
@bender-ui: collapsed
@bender-ckeditor-plugins: format, stylescombo, toolbar, wysiwygarea, undo

----

For each editor instance:

1. Choose one and create:
   1. Empty paragraph.
   2. Single paragraph with one line of text.
   3. Multiple paragraphs with text.
2. Select it using Ctrl+A.
3. Press one:
   1. backspace
   2. delete
   3. alphanumeric key
   4. enter key
   5. start typing some text.
4. Repeat.

**Expected result:** The editable should contain only elements typical for their respective enter modes.

Notes:

- &lt;p&gt; elements are colored green and &lt;div&gt; elements are colored red.
- You may experience a flashing &lt;div&gt; (Edge) or &lt;p&gt; (IE) element in all but the blockless inline editor.
- On Edge and Firefox an extra paragraph is created when you select all and press `Enter` it is a known bug.