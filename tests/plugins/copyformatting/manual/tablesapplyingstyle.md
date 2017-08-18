@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.6.2, trac16675
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo

1. Put cursor in the first cell.
2. Click "Copy Formatting" button.
3. Move cursor to the second cell, `Q^4`.

**Expected result:**

The styles are applied only to the second cell.

**Unexpected reusult:**

The styles are applied to all cells.
