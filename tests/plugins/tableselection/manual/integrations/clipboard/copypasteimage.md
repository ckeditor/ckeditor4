@bender-ui: collapsed
@bender-tags: bug, 4.14.0, 3278
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, undo, image, basicstyles

## 1st Editor:

## Scenario 1:

1. Copy image.
1. Paste it in the empty cell.

### Expected:

Image is copied, no rows or different elements are added.

### Unexpected:

Copying created additional row in table.

## Scenario 2:

1. Undo changes.
1. Fake select the first table cell.
1. Copy it and paste in the second cell.

### Expected:

Image is copied, no rows or different elements are added.

### Unexpected:

Additional row didn't appear.

## Scenario 3:

1. Fake select both cells of table.
1. Copy them and paste after the table.

### Expected:

New table with two cells appeared.

### Unexpected:

Only image without new table is pasted.

## 2nd Editor:

## Scenario 1:

1. Select whole text in the first cell.
1. Copy and paste in the second cell.

### Expected:

Formatted text is copied.

### Unexpected:

Text is not formatted.

## Scenario 2:

1. Undo changes.
1. Fake select the first cell.
1. Copy and paste in the second cell.

### Expected:

Only formatted text is copied without nesting new table.

### Unexpected:

Text is pasted into nested table.

## Scenario 3:

1. Undo changes.
1. Copy **some** text from the first cell and paste it in the second one.

### Expected:

Formatted text is copied.

### Unexpected:

Text is not formatted.

## 3rd Editor:

## Scenario 1:

1. Copy image from nested table.
1. Paste it to another cell.

### Expected:

Image is copied, no rows or different elements are added.

### Unexpected:

Additional row didn't appear.
