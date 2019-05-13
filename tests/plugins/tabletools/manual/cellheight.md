@bender-tags: 4.12.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, undo

## Test scenario

1. Open the cell properties dialog.

#### Expected:

Cell height unit is changeable (pixels or percents).

2. Change cell height to 20px.

#### Expected:

First row is lower than second one.

3. Change cell height to 70 percent.

#### Expected:

First row is higher than second one.
