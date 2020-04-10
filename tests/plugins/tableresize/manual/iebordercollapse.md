@bender-ui: collapsed
@bender-tags: bug, 2823, 4.14.1
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize, basicstyles, undo, sourcearea

_Perform test steps for both editors_.

## Steps

1. Move mouse over the right table border (border after the last column).

  ### Expected

  * Move cursor is visible.

	**Note**: cursor can become visible slightly _before_ the right border.

  ### Unexpected

  * Default cursor is visible.

2. Try to resize table using that border.

  ### Expected

  * Table is resized.

  ### Unexpected

  * Nothing happens.
