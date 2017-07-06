@bender-ui: collapsed
@bender-tags: bug, 168, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo

**Steps to reproduce:**

1. Select or click inside "AAA" and click "Copy Formatting" button.
2. Select "BBB" from right to left. Note that the cursor should be slightly below the line with "BBB".

**Expected:** "BBB" gets styled.

**Unexpected:** "BBB" remains unstyled.

---

**Additional check in inline editor:**

1. Put a selection inside first paragraph of inline editor, like so A^AA.
2. Press `Ctrl + Shift + C` to activate Copy Formatting.
3. Press `Down arrow` to move the caret into the line below.
4. Click with a mouse any element that is outside the editor.

**Expected:**

* "BBB" remains unstyled.
* Copy Formatting is switched off

**Unexpected:** "BBB" gets styled.
