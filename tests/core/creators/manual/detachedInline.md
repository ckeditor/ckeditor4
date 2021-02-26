@bender-tags: 4.17.0, bug, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar,link,format,undo,floatingspace,sourcedialog


**Note:** Open dev console to track eventual errors.

1. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data. Content is editable.

	**Unexpected:** Editor data is lost, content area is not editable.

2. Write some text in editor.

3. Repeat step 1.

	**Expected:** Editor shows with the same data. Content is editable.

	**Unexpected:** Editor data is lost, content area is not editable.

4. Click "Set data" button.

5. Repeat step 1.

	**Expected:** Editor shows with the same data. Content is editable.

	**Unexpected:** Editor data is lost, content area is not editable.

6. Write some additional text.

7. Repeat step 1.

	**Expected:** Editor shows with the same data. Content is editable.

	**Unexpected:** Editor data is lost, content area is not editable.
