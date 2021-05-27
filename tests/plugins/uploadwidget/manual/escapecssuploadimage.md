@bender-tags: 4.16.2, bug, 641
@bender-ui: collapsed
@bender-ckeditor-plugins: image, uploadimage, floatingspace
@bender-include: _helpers/xhr.js

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.

1. Open developer console.
2. Drag and drop some image into editor.

**Expected** Image is uploaded and inserted into editor.

**Unexpected** Image is uploaded but not inserted into editor.
