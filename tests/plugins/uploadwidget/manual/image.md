@bender-tags: clipboard, widget, filetools, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image, uploadimage, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, link
@bender-include: _helpers/xhr.js

Test if photo uploading works properly:

* Dropped image should be replaced by a temporary `upload widget` and by the final image (`image` plugin) when upload is done.
* `jpg`, `png`, `gif` and `bmp` files should be supported.
* Undo and redo during and after upload should work fine.
* It should be possible to format text and copy image during upload.
* If image is removed during upload, the process should be aborted.
* Check if you see a message about the progress, success and abort.
* Try to D&D elements which are not intended to be uploaded (e.g. empty anchor).
* Page shouldn't reload when image is drop on another one.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image.
