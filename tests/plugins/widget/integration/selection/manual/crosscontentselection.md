@bender-tags: 4.14.0, bug, 3498
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar, magicline, resize, elementspath, sourcearea, htmlwriter

1. Start selection at the first paragraph and release mouse above the widget.

	**Expected:** It's not possible to create partially selected widget. Releasing mouse button keeps selection only on previously selected text.

2. Repeat 1 step but start selection from the bottom instead. **Note:** this step will fail on Safari due to [#3850](https://github.com/ckeditor/ckeditor4/issues/3850).
