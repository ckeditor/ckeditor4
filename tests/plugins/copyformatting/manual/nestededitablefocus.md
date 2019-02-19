@bender-tags: bug, 4.11.3, 2655, 2470
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, copyformatting

1. Click inside "Widget 1" text to focus nested editable.
2. Click above the widget (above the black border).
3. Click once more inside "Widget 1" text.

## Expected

* Focus is moved into nested editable and stays there.
* Square under the editor is green.

## Unexpected

* Focus is moved into nested editable for a fraction of second and then disappears.
* Square under the editor is red.
