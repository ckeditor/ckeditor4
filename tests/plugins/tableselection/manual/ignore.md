@bender-ui: collapsed
@bender-tags: feature, 4.12.0, 2945
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard

1. Select the first table row.

**Expected:** Cells are selected with native browser selection.

**Unexpected:** Cells are selected with `tableselection` visual selection.

2. Click `Toggle ignore` button.
3. Again, select the first table row.

**Expected:** Cells are selected with `tableselection` visual selection.

**Unexpected:** Cells are selected with native browser selection.
