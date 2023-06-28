@bender-ui: collapsed
@bender-tags: feature, 4.22.0
@bender-ckeditor-plugins: wysiwygarea,toolbar,about

1. Open browser console.
1. Click the "Create editors" button.

**Expected**

1. There is only one console log in the console about insecure version.
2. There is notification in each editor.
3. There is info about insecure version in each editor's "About" dialog.

**Unexpected**

1. There is more than one console log.
2. There isn't a notification or info in the dialog in every editor.
