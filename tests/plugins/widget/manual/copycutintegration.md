@bender-tags: 4.13.1, bug, 3498
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar, magicline

1. Open browser's console.
2. Create selection which starts in text and ends in widget.
3. Copy selected part.
4. Paste it in editor.
5. Repeat the same procedure for the `cut` operation.

### Expected:
* When widget is partially selected, then is not copied/cut.
* When widget is fully selected, then is properly copied/cut.
* After cut there remain collapsed selection in the editor.

### Unexpected:
* There is an error in a console.
* Selected content is not copied/cut.

### Note:
There is a bug in Firefox related to undo steps which might appear when widget is partially cut. [#3552](https://github.com/ckeditor/ckeditor4/issues/3552)
