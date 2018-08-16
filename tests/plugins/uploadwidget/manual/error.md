@bender-tags:  4.5.0,bug,clipboard,widget,filetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: _helpers/xhrerror.js

This test emulates an error during upload. When upload hits 50% an error occurs.

 * Drop an image.
 * Check if `upload widget` is displayed.
 * Check if image is removed when it reaches 50% of progress and no artifacts left.
 * Check if you see a message about the error.
