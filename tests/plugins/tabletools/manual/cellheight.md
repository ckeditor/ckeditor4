@bender-tags: 4.12.0, 2084, 3098, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, undo

1. Open the cell properties dialog.

  #### Expected:

  - Cell height unit is changeable (pixels or percent).
  - Unit fields for `Width` and `Height` are the same width.

  #### Unexpected:

  - Cell height unit is not changeable or unit fields are not equally wide.

2. Change cell height to 20px.

  #### Expected:

  - First row is lower than second one.

  #### Unexpected:

  - Row height didn't change.

3. Change cell height to 70 percent.

  #### Expected:

  - First row is higher than second one.

  #### Unexpected:

  - Row height didn't change.
