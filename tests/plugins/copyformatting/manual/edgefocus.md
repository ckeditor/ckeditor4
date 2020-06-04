@bender-tags: bug, 4.10.0, copyformatting, 1458
@bender-ui: collapsed
@bender-ckeditor-plugins: copyformatting,toolbar,wysiwygarea,image2

## Test Scenario

1. Make sure the editor is not focused.
2. Select the image on the left by clicking on it.
3. Remove selection from the image by clicking outside the editor.
4. Again click on the image on the left.

## Expected

Image is selected.

## Unexpected

Image is not selected.
