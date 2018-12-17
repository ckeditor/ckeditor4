@bender-tags: 4.12.0, feature, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, sourcearea

1. Use resize handler to shrink image to minimum size.

1. Open dialog for this image.

	## Expected:

	Dialog fields are populated with correct width/height.

	## Unexpected:

	Dialog fields have wrong values.

1. Close dialog.

1. Use resize handler to increase image to maximum size.

## Expected:

- Images can't be resized beyond maximum values:

	- First editor: width/height: `350px`

	- Second editor: width/height: `image natural size`. This means image can't be bigger than it is at start.

## Unexpected:

- Images can be resized beyond maximum values.
