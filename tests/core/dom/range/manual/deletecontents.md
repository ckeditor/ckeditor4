@bender-tags: 4.12.0, bug, 3041
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, elementspath, undo, resize

1. Open developer console.
1. Press `Create range`.
1. Press `Delete range contents`.

	## Expected
	Editor content is removed.
	## Unexpected
	Error thrown

1. Press `Restore editor` and then `Create range`.
1. Open `image2` dialog.
1. Type any image URL, can be fake and press `OK`.

## Expected
Image is inserted into editor

## Unexpected
Error thrown
