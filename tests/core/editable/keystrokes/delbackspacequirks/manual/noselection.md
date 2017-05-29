@bender-tags: 4.7.1, tc, 13096
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea

1. Open browser console.
1. Click or select `Foo` text.
1. It's important to **not click** anywhere else to not loose editor focus.
1. Move mouse curosr above green rectangle below editor.
1. Selection should disappear and there should be **no caret** blinking.
1. Press `Delete`.
1. You can also press `Backspaace` but some browser (IE) can move to previous page.
1. There should be no errors in console.

**Expected:** No error in console.

**Unexpected:** Throwned error (might be related to undefined `startPath` or `range`).
