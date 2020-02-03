@bender-tags: 4.14.0, feature, 3441
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar

1. Select content inside the editor according to the instructions inside it. Drop the selected content into one of drop zones.

	## Expected

	After dropping widgets' content changes into `Widget dragged and dropped X times!` where `X` changes after every drop.

	## Unexpected

	Widgets' content doesn't change.
2. Check if undo is working correctly after performing operations (you can use the button above the editor to reset undo stack)

	## Expected

	Every operation is atomic, it does not create unnecessary, intermediate steps.

	## Unexpected

	Operations are broken into several steps.
