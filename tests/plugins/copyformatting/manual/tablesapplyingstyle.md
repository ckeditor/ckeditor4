@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo

1. In the first table put cursor in the first cell.
2. Click "Copy Formatting" button.
3. Move cursor to the second cell, `Q^4`.

**Expected result:**

The styles are applied only to the second cell.

**Unexpected reusult:**

The styles are applied to all cells in both tables.
