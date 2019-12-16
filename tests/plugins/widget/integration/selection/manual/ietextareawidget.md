@bender-tags: bug, 4.14.0, 3587, selection, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, elementspath, undo

1. Add widget (empty button in the toolbar).
2. Try to type inside the widget in the **textarea** field.
3. Deselect widget and select again.
4. Try to type in the textarea field inside widget.

## Expected:
* It's possible to type inside the widget
* _Note: selection inside widget might behave wrongly it's caused by naive widget implementation and it's not a bug._

## Unexpected:
* The entire widget's wrapper preserves focus so typing inside the textarea is not possible.
