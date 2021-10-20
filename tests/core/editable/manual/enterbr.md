@bender-tags: 4.17.0, bug, 3858
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, clipboard, enterkey, format, sourcearea


**Note**: Do not change the cursor position during the following steps.

1. Open browser's console.
2. Copy two paragraphs placed above the editor and paste them.

**Note**: This will also copy `<p>` elements that are around `a` and `b` letters.

3. Hit enter twice.
4. Type any (only one) letter and remove it using `backspace`.
5. Remember: don't change the cursor position. Paste again the same two paragraphs.

**Expected**

 * The paragraphs from `step 5` look the same as in `step2`.
 * The place where the paragraphs were pasted has not changed.
 * There is no error in the browser's console.

**Unexpected**

 * The paragraphs are not pasted.
 * The cursor position has moved after the `b` letter from `step 1`.
 * An error occurred in the browser's console: ```Cannot read properties of null (reading 'getParents')```
