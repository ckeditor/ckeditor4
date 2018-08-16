@bender-tags: 4.7.1, bug, trac13096, 457
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea

1. Open browser console.
1. Click or select `Foo` text.
1. It's important to **not click** anywhere else to not loose editor focus.
1. Move mouse cursor above green rectangle below editor.
1. Selection should disappear and there should be **no caret** blinking.
1. Press `Delete`. You can also press `Backspace` but some browsers (IE) can move to previous page.

**Expected:** No error in console.

**Unexpected:** Thrown error (might be related to undefined `startPath` or `range`).
