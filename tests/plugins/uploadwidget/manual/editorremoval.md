@bender-tags:  4.10.1, bug, 966
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, image2, uploadimage
@bender-include: _helpers/xhr.js

This test ensures that upload won't bleed if editor is destroyed during the upload.

1. Drop an image.
	* Note the editor will get automatically destroyed &mdash; that's fine 👌
1. Wait until a message is logged in the _output_ section, no longer than 4 secs though.

## Expected

* _Output_ section contains "File upload  aborted" message.
* No exceptions were thrown.

## Unexpected

No message is logged or editor throws exceptions like:

`Uncaught TypeError: Cannot read property 'find' of null`