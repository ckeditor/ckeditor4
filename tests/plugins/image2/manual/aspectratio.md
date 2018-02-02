@bender-tags: 4.9.0, bug, 1348
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, toolbar, image2, link, undo

1. Double click on the image to popup dialog.
2. Change url of the image to `/tests//_assets/lena.jpg`.
3. Ensure that the image is locked.
4. Change `width` to `400`.
5. Click `OK` button.

## Expected

The image has preserved aspect ratio.

## Unexpected

The image is streched, aspect ratio is not preserved.
