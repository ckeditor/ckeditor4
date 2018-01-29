@bender-tags: 4.9.0, feature, 932, 1533
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js
@bender-include: ./_helpers/tools.js

## Upload Progress

Remarks:

* In the end your image will be replaced with old CKEditor 4 logo.
* Upload progress is intentionally slowed down.

### Steps

1. Drop an image into the editor.

	### Expected

	* Upload progress is shown.
	* The image is a little transparent.

1. Wait till the image load completes.

	### Expected

	* Progress indicator disappear.
	* Image has its regular color.