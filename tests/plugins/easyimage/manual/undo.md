@bender-tags: 4.9.0, feature, 932, tp3183
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

## Easy Image Upload

Upload some images:

1. Execute one of the following steps:
	1. Make a screenshot, copy a graphic to the clipboard and paste using `ctrl/cmd+v`. This method does not work in Safari at the moment.
	1. Drag and drop an jpg/png/bmp/gif image from your OS explorer to the editable.
	1. Firefox only: Copy an image file (from your OS explorer) into the clipboard, and paste into the editable.
2. Click "Undo" button

### Expected

* Widget is removed from the editor.
* There is only one undo step.

### Unexpected

* Widget still exists after pressing "Undo".
* There are more than one undo step.
