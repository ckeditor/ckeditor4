@bender-tags: 4.12.0, feature, 3138
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar

**NOTE:** It's expected that if you paste the same copied content multiple times, widget copy counter won't change. Counter changes only during `copy`, `cut` and `drop` operations. Please also note that the counter is the same for every widget instance.

1. Manipulate the content by:

	* copying and pasting
	* cutting and pasting
	* dragging and droping

	both with one widget and content containing more than one widget.

	## Expected

	After each operation manipulated widget's content changes into `Widget has beed copied X times!` where `X` changes after every operation.

	## Unexpected

	Widget message doesn't change.
2. Check if undo is working correctly after performing operations (you can use the button above the editor to reset undo stack)

	## Expected

	Every operation is atomic, it does not create unnecessary, intermediate steps.

	## Unexpected

	Operations are broken into several steps.
