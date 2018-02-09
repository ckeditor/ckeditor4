@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../_helpers/tools.js

1. Click on image widget.
2. Click on one of buttons in balloon toolbar. **Note:** first style is a totally custom one, therefore it does not have any icon.
	## Expected:

	* Widget styles are changed.
	* Button state is changed to "on".
	* Other buttons states are changed to "off".
3. Click "Source" button.
4. Click it once more to close source view.
	## Expected:

	* Widget still has the same styles.
5. Click on widget.
6. Click on the same button in balloon toolbar.
	## Expected

	* Nothing happens.
7. Click on some other button in balloon toolbar.
	## Expected

	* Widget style changes.
