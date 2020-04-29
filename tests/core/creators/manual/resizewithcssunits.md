@bender-tags: bug, 4.14.1, 1883
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, table

## Scenario 1

1. In Width input type `20cm`.

1. In Height input type `10cm`.

1. Press `Resize!` button.

## Scenario 2

1. In Width input type `20cm`.

1. In Height input type `10cm`.

1. Tick `is content height` checkbox.

1. Press `Resize!` button.

## Scenario 3

1. In Width input type `20cm`.

1. In Height input type `10cm`.

1. Tick `resize inner` checkbox.

1. Press `Resize!` button.

## Expected

Editor changes its size.

## Unexpected

Editor is not resized.
