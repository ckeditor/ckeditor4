@bender-tags: bug, 4.8.1, copyformatting, 1458
@bender-ui: collapsed
@bender-ckeditor-plugins: copyformatting,toolbar,wysiwygarea,floatingspace,elementspath,image2,widget,justify,div

## Test Scenario

1. Make sure the editor is not focused.
2. Select the image on the left by clicking it.
3. Remove selection from the image by clicking outside of the editor.
4. Again click on the image on the left.

## Expected

Image is selected.

## Unexpected

Image is not selected.