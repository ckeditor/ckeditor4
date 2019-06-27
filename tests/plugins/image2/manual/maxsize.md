@bender-tags: 4.12.0, feature, 2048
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, sourcearea

# For each editors

1. Use resize handler to increase image to maximum size.

## Expected:

- Editor 1, Editor 2: Images can't be resized beyond maximum values.

- Editor 3: Image can be resized to any size.

## Unexpected:

- Editor 1, Editor 2: Images can be resized beyond maximum values.
