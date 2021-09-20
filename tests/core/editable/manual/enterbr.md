@bender-tags: 4.16.3, bug, 3858
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, clipboard, enterkey, format,


1. Open browser's console.
2. Copy two paragraphs placed above the editor. `<p>a</p><p>b</p>` and paste into editable.
3. Hit enter twice.
4. Type any ( only one ) letter and remove it using `backspace`.
5. Paste the the same two paragraphs from `step 1` ( don't change cursor position ).

**Expected**
 * The paragraphs from `step 5` are pasted correctly.
 * The indentation is correct.
 * There is no error in the browser's console.

**Unexpected**
 * The paragraphs are not pasted.
 * The cursor position has moved after the `b` letter from `step 1`.
 * An error occurred in the browser's console: ```Cannot read properties of null (reading 'getParents')```
