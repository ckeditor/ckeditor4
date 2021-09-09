@bender-tags: 4.16.2, bug, range, 3819
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo

**Note**: On mac devices, press `fn`+`backspace` whenever `delete` key is required.

1. Put caret right after the word `One`.
1. Type a space. The caret is now between two visual spaces.
1. Put caret to the left, so it will be before two visual spaces.
1. Use the delete key to remove one space.
1. Put caret right after the word `two`.
1. Type a space. The caret is now between two visual spaces.
1. Use the delete key to remove one space.

**Expected** Result content: `<p>One two three</p>`

**Unexpected** Result content: `<p>One&nbsp;two&nbsp;three</p>`
