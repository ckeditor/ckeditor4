@bender-tags: bug, 4.14.1, 1883
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, table

**For each scenario use one of these values:**
- `300`
- `10cm`
- `50mm`
- `400q`
- `8in`
- `20pc`
- `300pt`
- `200px`

## Scenario 1

1. In Width input type one of value listed above.

1. In Height input type one of value listed above.

1. Press `Resize!` button.

### Expected

Editor changes its size.

### Unexpected

Editor is not resized.

## Scenario 2

1. In Width input type one of value listed above.

1. In Height input type one of value listed above.

1. Tick `is content height` checkbox.

1. Press `Resize!` button.

### Expected

Editor changes its editing area.

### Unexpected

Editor is not changing its editing area.

## Scenario 3

1. In Width input type one of value listed above.

1. In Height input type one of value listed above.

1. Tick `resize inner` checkbox.

1. Press `Resize!` button.

### Expected

Editor changes its inner width.

### Unexpected

Editor is not changing its inner width.
