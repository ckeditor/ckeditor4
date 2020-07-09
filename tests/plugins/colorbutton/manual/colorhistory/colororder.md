@bender-tags: 4.15.0, feature, 1795
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, colordialog, sourcearea, removeformat, undo

**Note:** At the beginning open console and watch for errors (especially when picking colors).

1. Click on color button.

  **Expected:**

  1. Below default palette there is horizontal rule and color history row.
  1. There are 4 color boxes in color history row.
  1. Color boxes are ordered by number of occurences and further by order in document:
      * Strong Blue
	  * Red
	  * Grey
	  * Yellow

  **Unexpected:** Any of the above conditions is not met.

1. Click on `Automatic` color button.
1. Click on color button.

  **Expected:**

  * There is no error in console.
  * New color box didn't appear.

  **Unexpected:** Empty color box appeared at the beginning of history or error occurred.

1. Delete the entire editor contents.
1. Click on color button.

  **Expected:** Colors are still present and in the same order in history.

  **Unexpected:** Colors disappeared or reordered.

1. Click on background color button.

  **Expected:** Color history row with three colors is visible.

  **Unexpected:** Color history didn't show up.

1. Repeat all previous steps for each editor type.
