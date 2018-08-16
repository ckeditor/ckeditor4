@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath

**Procedure**

1. Put cursor in `Co{}py`.
2. Click "Copy Formatting" button.
3. Click inside `m{}e`.

**Expected:**

`me` gets underlined, line break is preserved.

**Unexpected:**

`me` gets underlined, line break is deleted.
