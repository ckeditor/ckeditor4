@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.11.3, 2780
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, undo, basicstyles

## Test both editors
1. Add some content to editor (e.g. new line), to "activate" undo step.
2. Start to click around editor to change selection inside editor (20-25 times). Selection **have to differ** between adjacent steps.

  ### Expected:
  Undo UI button is active.
  ### Unexpected:
  Undo UI became disabled.

3. Click undo button to revert change made in point 1. Make sure that Redo button is activated.
4. Make new selection inside editor.

  ### Expected:
  Redo UI button is active.
  ### Unexpected:
  Redo UI button became disabled.
