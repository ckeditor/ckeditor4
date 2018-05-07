@bender-tags: 4.9.0, feature, 932, 1533
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../_helpers/tools.js

## Upload Progress

Pro tip: you might want to [use browser throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference?hl=en#throttling) to make uploads longer.

### Steps

1. Drop an image into the editor.

	### Expected

	* Upload progress is shown.
	* The image is a little transparent.

1. Wait till the image load completes.

	### Expected

	* Progress indicator disappear.
	* Image has its regular color.
