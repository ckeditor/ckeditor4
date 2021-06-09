@bender-tags: 4.16.2, bug, range, 3819
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea

1. Put caret right after the word `Hello`.
2. Type a space. The caret is now between two visual spaces.
3. Press the left arrow to put caret before two visual spaces.
4. Use the delete key to remove one space from the right side.
5. Type a space and a new word "foobar".
5. Switch to source mode to see the actual results.

**Expected** `<p>Hello foobar world!</p>`

**Unexpected** `<p>Hello foobar&nbsp;world!</p>`
