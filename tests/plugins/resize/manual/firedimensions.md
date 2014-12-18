@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, resize

This test checks whether resize event is fired with dimensions as a properties. If so, destroying and creating editor instances should save its size.

1. Resize editor
2. Destroy and create editor.

**Expected result:** After creating new editor instance dimensions should be saved.