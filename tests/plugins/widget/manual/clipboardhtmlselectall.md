@bender-tags: 4.13.0, feature, 3138
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, undo, wysiwygarea, toolbar

1. Open console.
2. Select all.
3. Copy

## Expected

* Content is copied correctly, there are no errors inside the console.
* Selection is correctly restored after copying.

## Unexpected

* The error is thrown inside the console:

	```
	Uncaught TypeError: Cannot read property 'getParent' of null
	```
* Selection is not restored after copying.
