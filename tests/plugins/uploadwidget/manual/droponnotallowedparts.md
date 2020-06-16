@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2, uploadimage, toolbar, floatingspace
@bender-include: _helpers/xhr.js

1. Drag an image from the hard drive and drop it on disallowed UI elements:
 * toolbar (both static and floating),
 * bottom space,
 * dialog,
 * notification (use button to display).

**Expected:**
 * **Page shouldn't be reloaded!**
 * The `no–drop` cursor is visible (except IE)

**Note:** This test uses upload mock, which means it shows a dummy image.
