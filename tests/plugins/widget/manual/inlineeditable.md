@bender-tags: 4.20.2, bug, 698, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, basicstyles, widget

1. Open browser console.
1. Select `t` (the last letter) from `Test`.
1. Click the `Bold` toolbar button.
1. Switch to the source mode.

**Expected** Editor is switched to the source mode.

**Unexpected** There is an error in the console and editor is not switched to the source mode.

1. Switch back to the editing mode.

**Expected** Editor is switched to the editing mode.

**Unexpected** There is an error in the console and editor is not switched to the editing mode.
