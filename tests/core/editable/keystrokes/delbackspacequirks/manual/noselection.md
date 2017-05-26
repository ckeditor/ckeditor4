@bender-tags: 4.7.1, tc, 13096
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea

1. Open Chrome browser.
1. Open developer console in browser.
1. Make selection of whole text.
1. Click into inner padding of editor.
1. Selection should disappear and there should be **no caret**.
1. Press backspace.
1. Press delete.

**Expected:** No error in console.

**Unexpected:** Throwned error (might be related to `startPath`)
