@bender-tags: 4.5.0, 4.5.11, 4.6.0, tc, clipboard, widget, filetools, 13755
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, uploadwidget, basicstyles, image2, uploadimage, uploadfile, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify
@bender-include: _helpers/xhr.js

Test if photo uploading works properly:

* Dropped image should be replaced by a temporary `upload widget` and by the final image (`image2` plugin) when upload is dome.
* `jpg`, `png`, `gif` and `bmp` files should be supported.
* Drop any other files. The link to the file should be inserted.
* Undo and redo during and after upload should work fine.
* It should be possible to format text and copy image during upload.
* If image is removed during upload, the process should be aborted.
* Check if you see a message about the progress, success and abort.
* Page shouldn't reload when image is drop on another one.

**Note:** This test use upload mock which will show you *Lena* instead of the real uploaded image or show the link to the *Lena* file.
