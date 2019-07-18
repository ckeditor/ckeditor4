@bender-ui: collapsed
@bender-tags: bug, 3278, 4.13.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath, image

## Scenario 1:

1. Copy image.
1. Paste it in the empty cell.

**Expected:**

Image is copied, no rows or different elements are added.

**Unexpected:**

Copying created additional row in table.

## Scenario 2:

1. Fake select the first table cell.
1. Copy it and paste in the second cell.

**Expected:**

Image is copied and additional row is created.

**Unexpected:**

Additional row didn't appear.

## Scenario 3:

1. Fake select the first table cell.
1. Copy it and paste after the table.

**Expected:**

New table with image in it appeared.

**Unexpected:**

Only image without new table is pasted.
