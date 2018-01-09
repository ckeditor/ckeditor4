@bender-tags: clipboard, widget, filetools, 4.8.1, 1043, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image, uploadimage, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, link
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

Test if photo uploading works properly:

* Dropped image should be replaced by a temporary `upload widget` and by the final image (`image` plugin) when upload is done.
* Dropped `png` files should be supported. Check if temporary image showed up after dropping supported files.
* Any file format except `png` should NOT be supported. Try dropping not supported files and check if it has been rejected.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.