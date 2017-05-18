@bender-tags: 4.7.0, tc, 13096
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea

1. Open browser console.
2. Make selection of whole text.
3. Click into inner padding of editor.
4. Selection should disappear and there should be **no caret**.
5. Press backspace.
6. Press delete.

**Expected:** No error in console.

**Unexpected:** Throwned error (might be related to `startPath`)
