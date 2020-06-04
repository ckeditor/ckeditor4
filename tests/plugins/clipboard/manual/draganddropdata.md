@bender-tags: bug, 4.7.0, trac16777, dataTransfer
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea, elementspath, clipboard, image2, uploadimage, uploadwidget
@bender-include: ../../../plugins/uploadwidget/manual/_helpers/xhr.js

## Test scenario

- Drop a few of the "Droppable Contacts" into the editable.
- Drop an image from the filesystem into the editable.

## Expected result

Both operations possible, no errors.

## Unexpected

Impossible to drop either contacts, or image, or both.
