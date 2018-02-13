@bender-ui: collapsed
@bender-tags: 4.10.0, feature, 1558, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,notification,balloontoolbar,sourcearea,list,link,dialog

----

1. Click on a list item to open the balloontoolbar
2. Press one of buttons displayed in balloontoolbar to open a dialog
3. Check if the dialog behave properly:
  - Can be closed with `x` button
  - React on both OK and Cancel buttons, which close the dialog
  - Dialog can be blured, and after bluring the dialog, balloontoolbar is reset to default view

Repeat above steps for:
 - second button
 - confirmation turned on
