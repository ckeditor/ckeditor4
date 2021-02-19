@bender-tags: 4.17.0, bug, 4462, divarea
@bender-ui: collapsed
@bender-ckeditor-plugins: divarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo


1. Open dev console

2. Click "Toggle" button twice. To hide and show editor.

	**Expected:** Editor shows with same data. Content is editable. Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

3. Write some text in editor.

4. Repeat step 2.

	**Expected:** Editor shows with same data. Content is editable. Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

5. Click "Set data" button.

6. Repeat step 2.

	**Expected:** Editor shows with same data. Content is editable. Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

7. Write some additional text.

8. Repeat step 2.

	**Expected:** Editor shows with same data. Content is editable. Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

