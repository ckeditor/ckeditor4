@bender-tags:  4.5.4,tc,13553,clipboard,widget,filetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: _helpers/xhrnoupload.js

This test emulates situation when xhr.upload object is not present, so upload progress cannot be monitored.

 * Drop an image.
 * Check if `upload widget` is displayed.
 * Upload progress will not be reported - it will jump from 0% to upload success.
 * Check if upload is complete and test image is visible.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.
