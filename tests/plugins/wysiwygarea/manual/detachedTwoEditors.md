@bender-tags: 4.17.0, bug, 4462, wysiwygarea
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track eventual errors.

1. Click "Toggle" button twice. To hide and show the second editor.

	**Expected:** Editor shows with same data. Content is editable. Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.
