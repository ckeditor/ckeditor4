@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp2245
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, link, sourcearea, undo, elementspath

1. Select two cells in the first row.
2. Press "Link" button or `Ctrl/Cmd + L`.
3. Set URL to "foo" and change protocol to "https://".
4. Press "OK".
5. Select only second cell.
6. Press "Link" button or `Ctrl/Cmd + L`.

**Expected:**
Changed values are shown.

**Unexpected:**
Default values are shown.
