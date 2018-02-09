@bender-tags: 4.9.0, bug, 1550, easyimage
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, toolbar, easyimage, link
@bender-include: ../_helpers/tools.js

----

1. Move cursor over image in both editors.

**Expected:** Nothing unusual happens, scrollbar is not flickering.

**Unexpected:**
* Empty scrollbar shows up.
* Scrollbar flickers when cursor is moved over the images.

_**Note:** In **Chrome** browser scrollbars flicker in second editor as the issue is not fixed
for `divarea editor` (https://bugs.chromium.org/p/chromium/issues/detail?id=803045)._
