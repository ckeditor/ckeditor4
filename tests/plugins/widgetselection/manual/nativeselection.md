@bender-tags: 4.12.0, bug, 2517, 3007, 3008
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, elementspath, undo, resize

1. Open browser console.
1. Start selecting text from right with mouse.
1. Release mouse over bottom of a widget.
1. Press <kbd>BACKSPACE</kbd>

	- ## Expected
		- Selected text is removed.

	- ## Unexpected
		- The widget caption is removed.
		- Selection is in the widget caption.
		- Selected text is not removed.

1. Press `Undo`.

	- ## Unexpected
		- `Image` button is disabled.

1. Press `Image` button.
1. Enter any image source (may be fake) and press `OK`.

## Expected
- Image is inserted.

## Unexpected
- Image isn't inserted.
- Error is thrown.
