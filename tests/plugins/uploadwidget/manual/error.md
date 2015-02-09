@bender-tags:  4.5.0,tc,clipboard,widget,filetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: _helpers/xhrerror.js

This test emulate an error during upload. When upload hit 50% an error occurred.

 * Dropp image.
 * Check if `upload widget` is displayed.
 * Check if image is removed after it get 50% of progress and no artifacts left.
 * Check if you see an message about the error.