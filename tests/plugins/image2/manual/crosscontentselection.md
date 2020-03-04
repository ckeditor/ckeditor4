@bender-tags: 4.14.0, bug, 2517
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

**Please note**:

* Selecting over the widget collapses selection on Safari due to [#3850](https://github.com/ckeditor/ckeditor4/issues/3850). However, you should still follow test steps to verify if selection is inside the editor.
* You can use such link: `/tests/_assets/lena.jpg`.


1. Open browser console.
1. Start selection at the text below the image (`^`) and release mouse button over the image.
1. Open image dialog and insert new image.

	**Expected:** New image has been added to the editor.

	**Unexpected:** Browser console error shows up.
