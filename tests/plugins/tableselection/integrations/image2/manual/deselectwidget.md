@bender-tags: 1027, 4.8.0, widget, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: undo,clipboard,basicstyles,toolbar,wysiwygarea,widget,table,tableselection,resize,image2

1. Click on the image of Lena.
1. Click into another cell and start to: _(Do not click outside of the table!)_
  * type something
  * add new image (path to Lena's image is above the editor)

**Expected:**
  * You can freely type and edit text.
  * You can add new images.
  * Image dosen't persist the selection.

**Unexpected:** You can't do things listed in 'expected'. Selection remain on image all the time.
