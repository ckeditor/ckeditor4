@bender-tags: 4.13.0, bug, 3379
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, clipboard, image2

## For each editor

1. Drag and drop image into "Drop here" place.
2. Inspect the number of `beforeGetData` events above the editor.

## Expected

The number of events equal 0.

## Unexpected

The number of events is higher than 0.
