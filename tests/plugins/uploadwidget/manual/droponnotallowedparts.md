@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar, floatingspace
@bender-include: _helpers/xhr.js, _helpers/manualplayground.js

1. Drag and drop some image into not allowed elements (toolbar, bottom, dialog, notification - use button to display).

**Expected result:** There should be visible an no drop cursor on that elements (expect IE).

**Unexpected result:** Page shouldn't be reloaded.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.
