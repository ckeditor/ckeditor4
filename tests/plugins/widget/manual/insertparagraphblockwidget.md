@bender-tags: 4.17.0, feature, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

## Insert a paragraph before and after a widget

Test should be performed with browser dev tools opened.

1. Focus the widget.
1. Press <kbd>SHIFT + ALT + ENTER</kbd>.

  **Expected:**

  * A paragraph should appear before the widget.
  * No errors occured.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** Any of the above conditions is false.

1. Press undo button.
1. Make sure widget is focused.
1. Press <kbd>SHIFT + ENTER</kbd>.

  **Expected:**

  * A paragraph should appear after the widget.
  * No errors occured.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** Any of the above conditions is false.

1. Press <kbd>SHIFT + ENTER</kbd> again.
1. Switch to source mode.

  **Expected:**

  `<br>` element was inserted.

  **Unexpected:**

  `<p>` element was added or nothing happened.
