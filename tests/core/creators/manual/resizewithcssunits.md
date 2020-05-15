@bender-tags: bug, 4.14.1, 1883
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, table

**For each scenario use one of these values:**
- `300`
- `10cm`
- `50mm`
- `8in`
- `20pc`
- `300pt`
- `200px`

## Scenario 1

1. Fill width and height fields with values from the beginning of the test.
1. Press `Resize!` button.

### Expected

The whole editor changes its size reflecting used unit values.

## Scenario 2

1. Fill width and height fields with values from the beginning of the test.
1. Tick `is content height` checkbox.
1. Press `Resize!` button.

### Expected

Editor changes its size of editing area reflecting used unit values. Note that the toolbar shouldn't be included in resize.
