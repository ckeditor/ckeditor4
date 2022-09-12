@bender-tags: 4.20.0, feature, 5215
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, sourcearea, elementspath, undo, floatingspace

1. Select `foo` text.
2. Click `subscript` button.
3. Click `superscript` button.

**Expected** Selected text contain only `superscript` style.

**Unexpected** Selected text contain `subscript` and `superscript` style.

4. Click `undo` button.

**Expected** There is only one step needed to back to enabled `subscript` button.

5. Repeat above steps for inline editor.
