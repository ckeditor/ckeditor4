@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar
@bender-include: _helpers/xhr.js

**Ignore this test unless running Bender 0.2.3+.**

1. Drag and drop some image into editable.

**Expected result:** Image should be uploaded and you should see *Lena* **upside down**.

**Unexpected result:** After upload no *Lena* is shown.
