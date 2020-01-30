@bender-tags: 4.14.0, feature, 3547
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link, image

1. Open `link` dialog.

  **Expected:** Both values in red boxes are the same and equal to `Link Info`.

  **Unexpected:** Values are different or one of them is not present.

1. Change tab to `Advanced`.

  **Expected:** Both values in red boxes are the same and equal to `Advanced`.

  **Unexpected:** Second value didn't change.

1. Close `link` dialog.

1. Open `image` dialog.

  **Expected:** Both values in red boxes are the same and equal to `Image Info`.

  **Unexpected:** Values didn't change after new dialog was opened.

**Important**: Keep in mind that values are refreshed on interval so you may see slight delay when changing tabs very fast.
