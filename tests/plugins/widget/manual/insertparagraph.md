@bender-tags: widget, feature, 4.16.1, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

## Insert a paragraph before and after a widget

Test should be performed with browser dev tools opened.

1. Focus the widget.
1. Press `SHIFT + ALT + ENTER`.

  **Expected:**

  * A paragraph should appear before the widget.
  * No errors occured.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** No paragraphs are inserted before the widget.

1. Press undo button.
1. Make sure widget is focused.
1. Press `SHIFT + ENTER`.

  **Expected:**

  * A paragraph should appear after the widget.
  * No errors occured.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** No paragraphs are inserted after the widget.
