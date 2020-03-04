@bender-tags: 4.14.0, bug, 3698
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar, magicline, resize, elementspath, sourcearea, htmlwriter

1. Start selection at the middle of the second paragraph (`^`) and release mouse button over the widget.
1. Press `CTRL + X` keyboard shortcut.

	**Expected:** Selected text from a paragraph is removed.

	**Unexpected:** Text is removed and both paragraphs are merged into one.
