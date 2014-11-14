@bender-tags: selection, focus
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea

**Before starting:** Open the console.

----

1. Click inside the 1st editor to focus it.
2. **Expected:** "Editor 1: focus" should be logged once.
3. Wait for data change (2s).
4. **Expected:** Nothing should be logged.
5. **Expected:** There should be a blinking caret in the editor.
6. Click outside the editor.
7. **Expected:** "Editor 1: blur" should be logged once.

----

1. Click inside the 2nd editor to focus it.
2. **Expected:** "Editor 2: focus" should be logged once.
3. Wait for data change (2s).
4. **Expected:** Nothing should be logged.
5. **Expected:** There should be a blinking caret in the editor.
6. Click outside the editor.
7. **Expected:** "Editor 2: blur" should be logged once.