@bender-tags: 4.14.1, bug, 3926
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

**Note:** IE[8-11] due to [#4076](https://github.com/ckeditor/ckeditor4/issues/4076) image cannot be dropped at the end of the editor.

1. Open browser developer console.
1. Drag and drop the widget at the beginning or at the end of the editor.

**Expected:** Widget is draggable. No console errors.

**Unexpected:** Widget is not draggable. Browser dev console reports some errors.
