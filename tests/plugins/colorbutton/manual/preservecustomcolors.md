@bender-tags: feature, 1795, 4.14.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

**Note:** For mobiles **ignore** step #5 (the one with hovering).

1. Select `^`.

1. Click `Text Color` button.

  **Expected:**

  * `Custom Colors` section (label and row) is not visible.

  * `Content Colors` section is visible.

  * `More Colors` button is below `Content Colors` section.

1. Click `More Colors` and choose color `#aa22ff`.

1. Click `Text Color` button.

  **Expected:**

  * Chosen color appears in both `Custom Colors` and `Content Colors` sections.

1. Hover over color tile from `Custom Colors` section.

  **Expected:**

  * Tooltip contains uppercase hex color code without `#` hash (`AA22FF`).

  **Unexpected:**

  * Tooltip is empty or contains lowercase content.

1. Open `More Colors` dialog and choose color `#ffff00`.

1. Click `Text Color` button.

  **Expected:**

  * New color is at the beginning of the `Custom Colors` section.

  * Old color is still displayed.

  **Unexpected:**

  * New color appeared after old color.

  * Old color disappeared.

1. Open `More Colors` dialog and choose `#aa22ff` again.

1. Click `Text Color` button.

  **Expected:**

  * There are still two colors in the `Custom Colors` section.

  * Color `#AA22FF` is the first one, `#FFFF00` is the second one.

  **Unexpected:**

  * Colors didn't exchange position.

  * Second tile with the same color was added.

1. Focus editor.

1. Delete the entire editor contents.

1. Click `Text Color` button.

  **Expected:**

  * `Custom Colors` section still contains two colors.

  * `Content Colors` section disappeared.

  **Unexpected:**

  * `Custom Colors` section disappeared.

  * `Content Colors` label or whole section is still visible.

1. Choose a new color from color dialog 5 more times (different color each time).

1. Click `Text Color` button.

  **Expected:**

  * Only 6 color tiles are displayed.

  * `#FFFF00` is not visible.

  **Unexpected:**

  * More (or less) color tiles are visible.

  * Colors didn't keep order from the newest to the oldest.

  * Different color than `#FFFF00` disappeared from the pallette.

1. Repeat all previous steps using `Background Color` button instead.

1. Repeat all previous steps for `Divarea` and `Inline` editors.
