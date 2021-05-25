@bender-tags: 4.17.0, bug, 4333
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

1. Click on "Text Color" button.
2. Click "More colors" button.
3. Type `red` in the color input.
4. Press "OK".
5. Press "Text Color" button.

	**Expected:** Color history contains red box.

	**Unexpected:** Color history contains transparent box or more than one red box.
6. Repeat with other values:
	* `rgb( 255, 0, 0 )`
	* `rgba( 255, 0, 0, 1 )`
	* `hsl( 0, 100%, 50% )`
	* `hsla( 0, 100%, 50%, 1 )`
7. Repeat in inline editor.
