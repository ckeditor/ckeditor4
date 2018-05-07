@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, undo, easyimage
@bender-include: ../../_helpers/tools.js

Check integration between balloon toolbar and easy image:

* Clicking on image should show balloon toolbar with three buttons.
	* First button should change image to full size.
	* Second button should change image to side image.
	* Third button should show dialog for changing alt text.
* Balloon toolbar position should be refreshed according to changes of image's size.
* Buttons in toolbar should mirror real commands' states.
