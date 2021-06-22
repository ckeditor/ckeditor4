@bender-tags: 4.16.2, bug, range, 3819
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo

1. Put caret right after the word `One`.
1. Type a space. The caret is now between two visual spaces.
1. Press backspace to remove the first space on the left side of the caret.
1. Put caret right after the word `two`.
1. Type a space. The caret is now between two visual spaces.
1. Move the caret to the right, so it will be after two visual spaces.
1. Press backspace.

**Expected** Result content: `<p>One two three</p>`

**Unexpected** Result content: `<p>One&nbsp;two&nbsp;three</p>`
