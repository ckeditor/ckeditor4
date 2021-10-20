@bender-tags: 4.17.0, bug, 4892
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, find, forms, link

1. Set the High Contrast Mode to white.
2. Open one of the dialogs.
3. Use the `TAB` key on the keyboard to move focus to the `Cancel`, `OK` or `Close` buttons.

**Expected**

When you select `OK`, `Cancel` or `Close` button, the focus should have a border and be clearly visible.

**Unexpected**

When the button is focused, it becomes smaller and the difference between focused and unfocused button is very slight.
