@bender-tags: 4.14.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

**Note:** At the beginning open console and watch for errors (especially when picking colors).

1. Click on color button.

  **Expected:**

  1. Below default palette there is horizontal rule and color history row.
  1. There are 4 color boxes in color history row.
  1. Color boxes are ordered by number of occurences and further by order in document:
      * Blue (occures 2 times in document)
	  * Red (occures 1 time and is 1st color in doc)
	  * Grey (occures 1 time and is 2nd color in doc)
	  * Yellow (occures 1 time and is 3rd color in doc)

  **Unexpected:**

  * Any of the above conditions is not met.

1. Hover over the first color box from color history.

  **Expected:**

  * Tooltip contains color name (`Strong Blue` or it's equivalent in other lang).

  **Unexpected:**

  * Tooltip is empty or contains hex code instead of name.

1. Hover over the second color box from color history.

  **Expected:**

  * Tooltip contains uppercase hex color code without `#` hash (`FF0000`).

  **Unexpected:**

  * Tooltip is empty or contains lowercase content.

1. Delete the entire editor contents.

1. Click on color button.

  **Expected:**

  * Colors are still present and in the same order in history.

  **Unexpected:**

  * Colors disappeared or reordered.

1. Click on background color button.

  **Expected:**

  * Color history row doesn't appear.

  **Unexpected:**

  * Color history is the same as for text color.

1. Repeat all previous steps for each editor type.
