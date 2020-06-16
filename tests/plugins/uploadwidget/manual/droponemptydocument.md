@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar
@bender-include: _helpers/xhr.js

1. Drag and drop some image into editable.

**Expected result:** Image should be uploaded.

**Unexpected result:** Page shouldn't be reloaded.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.
