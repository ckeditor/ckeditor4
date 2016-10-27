@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, basicstyles, elementspath, undo

**Procedure for the first editor**

1. Place cursor inside styled part of text.
2. Press `Ctrl+Shift+B` to copy styles.
3. Move the selection using the keyboard.
4. Press `Ctrl+Shift+M` to apply styles.

**Expected**

* The keystrokes are working.

**Procedure for the second editor**

1. Place cursor inside styled part of text.
2. Press `Ctrl+Shift+C`.
3. Move the selection using the keyboard.
4. Press `Ctrl+Shift+V`.

**Expected**

* The keystrokes are not activating Copy Formatting functions.
