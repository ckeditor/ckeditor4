@bender-tags: 4.16.2, bug, range, 3819
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea

1. Put caret right after the word `Hello`.
2. Type a space. The caret is now between two visual spaces.
2. Press backspace to remove the first space on the left side of the caret.
3. Type a space again.
4. Type a new word "foobar".
5. Switch to source mode to see the actual results.

**Expected** `<p>Hello foobar world!</p>`

**Unexpected** `<p>Hello foobar&nbsp;world!</p>`