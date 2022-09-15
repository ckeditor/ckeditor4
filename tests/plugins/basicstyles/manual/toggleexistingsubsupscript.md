@bender-tags: 4.20.0, feature, 5215
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, sourcearea, elementspath, undo, floatingspace

1. Select `foobar` text.
2. Click subscript button.

**Expected** Selected text contain only `superscript` style.

3. Click undo button.
4. Click redo button.

**Expected** There is only one step needed to back to enabled `subscript` button.

5. Repeat above steps for `subscript` button.
