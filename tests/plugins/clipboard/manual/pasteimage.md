@bender-ui: collapsed
@bender-tags: 4.8.0, tc, clipboard, feature, 505, trac16908
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

**Procedure 1:**

1. Paste image from clipboard into the editor.
2. Open `Source`.
 
**Expected result:**

Image is pasted as a blob URI/URL file, e.g. `<img src="blob:http://localhost:1030/41f059fb-62e8-40e4-aac7-617d520241b1" />`

**Procedure 2:**

1. Paste image from clipboard into the editor.
2. Play with editor by adding text, changing text format, adding a new image.
3. Use undo/redo button multiple times.

**Expected result:**

The undo/redo state changes correctly.
Pasted image as a blob URI/URL has the same format as before.
