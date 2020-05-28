@bender-tags: bug, 4.14.1, 3875
@bender-ckeditor-plugins: wysiwygarea,toolbar,elementspath,undo,image2,embed
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js

1. Open browser developer console.
1. Drag and drop the embedded image at the beginning or at the end of the editor.

**Expected:** Image is draggable. No console errors.

**Unexpected:** Image is not draggable. Browser dev console reports some errors.
