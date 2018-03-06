@bender-tags: bug, 4.7.0, 4.10.0, trac16845, copyformatting, 1458
@bender-ui: collapsed
@bender-ckeditor-plugins: copyformatting,toolbar,wysiwygarea,image2,justify,div

## Test Scenario

1. Make sure the editor is not focused and scroll it down.
2. Select the image on the right by clicking it.

## Expected

Image is selected.

## Unexpected

The editor scrolls to the top.
