@bender-tags: 4.17.0, feature, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

1. Focus the first widget.
1. Press <kbd>SHIFT + ENTER</kbd>.

  **Expected:**

  * A paragraph should appear between the widgets.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** Any of the above conditions is false.

1. Press undo button.
1. Focus the second widget.
1. Press <kbd>SHIFT + ALT + ENTER</kbd>.

  **Expected:**

  * A paragraph should appear between the widgets.
  * Selection is moved into the newly created paragraph.
  * There is an undo step created.

  **Unexpected:** Any of the above conditions is false.
