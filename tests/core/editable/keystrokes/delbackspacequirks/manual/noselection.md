@bender-tags: 4.7.1, tc, 13096
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea

1. Open browser console.
1. When you will be ready press `Start` button below editor.
1. Click into `Foo` text.
1. It's important to not click anywhere else to not loose editor focus.
1. Entire text should automatically be selected.
1. Now use only mouse **without** clicking.
1. Move curosr below text and then move it again above selection.
1. Selection should disappear and there should be **no caret**.
1. Press `Delete`.
1. You can also press `Backspaace` but some browser (IE) can move to previous page.
1. There should be no errors in console.

**Expected:** No error in console.

**Unexpected:** Throwned error (might be related to `startPath` or `range` which would be undefined).
