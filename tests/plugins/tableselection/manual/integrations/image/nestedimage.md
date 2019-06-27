@bender-ui: collapsed
@bender-tags: bug, 2235, 4.12.0
@bender-ckeditor-plugins: wysiwygarea, tableselection, image, undo

## Context menu for image in table

### Scenario 1:

1. Open context menu for image by right-clicking it.
2. Choose `Image properties`.

	**Expected result:**

	URL field should be filled and image should be visible in the preview.

	**Unexpected result:**

	URL field is empty or image isn't visible in the preview.

### Scenario 2:

1. Select first row of the outer table and delete it.
2. Click on the image again.

	**Expected result:**

	Image is selected.

	**Unexpected result:**

	Image can't be selected.
