@bender-tags: 4.20.2, bug, 5414
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, easyimage, undo
@bender-include: ../_helpers/tools.js

1. Drop image into the editor.
1. Wait for its upload.

**Expected** There are two change events noted under the editor.
**Unexpected** There is only one change event noted under the editor.

**Note** You can check editor's data for each `change` event in the browser console.
