@bender-ui: collapsed
@bender-tags: bug, 4.8.0, 704
@bender-ckeditor-plugins: image2, wysiwygarea, undo, sourcearea

----
1. Put caret in the text on the right and type some text.
1. Use `Ctrl + Z` or `Cmd + Z` shortcut to make undo few times.

**Expected:** Text returns to previous form. Below the editor, you should see `div` on green background.

**Unexpected:** Text moves below the image. Below editor, it will be written `figure` instead of `div` on the green background.
