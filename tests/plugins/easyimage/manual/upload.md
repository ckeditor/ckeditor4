@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

## Easy Image Upload

Upload some images:

1. Execute one of the following steps:
	1. Make a screenshot, copy a graphic to the clipboard and paste using `ctrl/cmd+v`.
	1. Drag and drop an jpg/png/bmp/gif image from your OS explorer to the editable.
	1. Firefox only: Copy an image file (from your OS explorer) into the clipboard, and paste into the editable.

### Expected

* Image gets inserted into the editable.
* Image gets a `src` starting with `https://<something>.cdn.cke-cs.com/` (You can check that using source mode).
