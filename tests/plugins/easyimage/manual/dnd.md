@bender-tags: 4.8.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage

**Procedure:**

1. Drag and drop some files from the desktop into each editor. You can drop multiple files

**Expected result:**

All dropped images are inserted into the editor as Easy Image widgets.

**Unexpected result:**

* Images are not inserted.
* Non-image files are inserted.
* Images are inserted in the wrong place (not inside the range which was selected during drop).
* Images are not converted into widgets.
