@bender-tags: bug, 4.7.0, trac16777, dataTransfer, 4.10.0, 1832
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, sourcearea, elementspath, clipboard, image2, uploadimage, uploadwidget
@bender-include: ../../../plugins/uploadwidget/manual/_helpers/xhr.js

## Test scenario

- Drop a few of the "Droppable Contacts" into the editable.
- Drop an image from the filesystem into the editable.

## Expected result

Both operations possible, no errors. During drag there should be visible caret in editable. After drop widget should appear in last caret position.

## Unexpected

- Impossible to drop either contacts, or image, or both.
- There is no caret during drag.

#### Note:

Dragging elements into editor will paste them into current collapsed selection. If selection is inside Widget element nothing will happen because it is `readonly` element.
