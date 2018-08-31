@bender-tags: 4.10.1, bug, 1348
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2

1. Double click on the image to open dialog.
2. Change url of the image to `/tests/_assets/lena.jpg`.
3. Ensure that image aspect ratio is locked.
4. Change `width` to `400`.
5. Click `OK` button.

## Expected

The inserted image has preserved aspect ratio.

## Unexpected

The inserted image is stretched, aspect ratio is not preserved.
