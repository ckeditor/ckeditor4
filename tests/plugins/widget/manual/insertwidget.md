@bender-tags: 4.11.4, bug, 2517
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, elementspath

1. Open browser console.
1. Start selecting text from right with mouse.
1. Release mouse over right side of an image.
1. Press `Image` button.
1. Enter any image source (may be fake) and press `OK`.

## Expected

- Image is inserted.

## Unexpected

- Image isn't inserted.
- Error is thrown.
