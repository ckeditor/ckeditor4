@bender-tags: 4.9.1, 966, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar
@bender-include: _helpers/xhr.js

1. Open browser console.
2. Drag and drop some image into editable.
3. Click `Destroy` button during image upload.

## Expected

Editor has been destroyed. No errors showed up in a console.

## Unexpected

Editor has not been destroyed and/or any error showed up in a console.
