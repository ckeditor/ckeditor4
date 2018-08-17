@bender-tags: bug, 4.5.5, trac13782, editor
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, clipboard, toolbar, floatingspace

----

1. Select some text in the first editor.
2. Press `CTRL + X`.
3. Try to paste into the textarea above the editors.

**Expected:**
* Text shouldn't be removed from editor.
* Text selected in the editor shouldn't be pasted into the textarea.

----

1. Select some text in the second editor.
2. Press `CTRL + X`.
3. Try to paste into the textarea above the editors.

**Expected:**
* Text shouldn't be removed from editor.
* Text selected in the editor shouldn't be pasted into the textarea.
