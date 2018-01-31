@bender-tags: 4.9.0, bug, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, toolbar, easyimage, link

----
Note: Problem exists only in **Chrome** browsers. All other browsers should work fine and flickering scrollbar shouldn't be present.

1. Move cursor over image in both editors.

**Expected:** Nothing unusal happen in 1st editor. Unfortunatelly bug is not fixed in divarea editor, so flickering should be observable in bottom editor, what is expected behaviour here.

**Unexpected:**
  * Empty scrollbar shows up.
  * Scrollbar flicker when cursor is moved over the images.
