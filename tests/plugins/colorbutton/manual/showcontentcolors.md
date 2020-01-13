@bender-tags: feature, 1795, 4.14.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, sourcearea, removeformat, undo

**Note:** For mobiles **ignore** steps #3 and #4 (the ones with hovering).

1. Select `^`.

1. Click `Text Color` button.

  **Expected:**

  * `Content Colors` section (label and color tiles) is displayed below default pallette.

  * Default text color (most probably something blackish like `#333333`) is not displayed in `Content Colors` section.

  * Colors are displayed in the correct order:
    1. Strong Red
	1. 008800 (Green)
	1. Strong Blue
	1. Vivid Yellow
	1. Amethyst (Violet)

  * Selected color is red from the `Content Colors` section.

1. Hover over green color tile from `Content Colors` section.

  **Expected:**

  * Tooltip contains uppercase hex color code without `#` hash (`008800`).

  **Unexpected:**

  * Tooltip is empty or contains lowercase content.

1. Hover over yellow color tile from `Content Colors` section.

  **Expected:**

  * Displayed tooltip says **Vivid Yellow**.

  **Unexpected:**

  * Color code is displayed instead.

1. Click `Background Color` button.

  **Expected:**

  * `Content Colors` section (label and color tiles) is displayed below default pallette.

  * Colors are displayed in the correct order:
    1. Strong Red
	1. 008800 (Green) // **Correct order and names may change**.

  * Selected color is green from the `Content Colors` section.

1. Focus editor.

1. Select the entire editor contents.

1. Change text and background color.

1. Click `Text Color` button.

  **Expected:**

  * Only selected color appears in `Content Colors` section.

1. Check that the same is true for `Background Color` button.

1. Delete the entire editor contents.

1. Click `Text Color` button.

  **Expected:**

  * `Content Colors` section is not visible anymore.

  **Unexpected:**

  * `Content Colors` section or label is still visible.

1. Check that the same is true for `Background Color` button.

1. Click the `Set content` button below editor.

1. Click `Text Color` button.

  **Expected:**

  * Only 6 colors are displayed in `Content Colors` section.

  **Unexpected:**

  * Excessive color tiles were not removed.

1. Repeat all previous steps for `Divarea` and `Inline` editors.
