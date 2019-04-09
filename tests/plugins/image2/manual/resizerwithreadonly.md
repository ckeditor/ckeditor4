@bender-tags: 4.7.3, 4.11.4, bug, 719, 2816, 2874
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2

## Classic Editor

1. Focus the image.

**Expected:** The image resize handler is visible.

## ReadOnly Editor

1. Focus the image.

**Expected:** The image resize handler is not visible.

2. Click `Toggle read-only mode` multiple times focusing image every time after button click.

**Expected:** The image resize handler is enabled/disabled depending on the read-only mode state.
