@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace


**In IE and Edge cursor does not change.**

**Procedure**

1. Place cursor inside styled part of text.
2. Click "Copy Formatting" button in the toolbar.
3. Move the cursor outside the editor.
4. Click anywhere outside the editor.

**Expected**

* The cursor outside the editor is a default one.
* Clicking outside the editor switches off the "Copy Formatting".

**Unexpected**

* The cursor outside the editor is a "disabled" one.
