@bender-tags: 4.13.0, bug, widget, 3198
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, undo

## Scenario 1

1. Click on a widget.
1. Click outside of the editor.
1. Click on the widget again.

### Expected
Undo steps count is 1.

### Expected
Undo steps count is 2 or more.

## Scenario 2

1. Place caret in text after `Foo`.
1. Type something.
1. Click on widget.
1. Click outside of the editor.
1. Place caret in text after `Bar`.
1. Repeat step 2.
1. Press `Undo` button exactly two times.

### Expected

- Undo button is disabled.
- Changes from step 1 and 5 are reverted.

## Unexpected

- Undo button is enabled.
- Widget is focused.
- Changes from step 1 is not reverted.
