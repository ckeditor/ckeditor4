@bender-ui: collapsed
@bender-tags: 4.16.1, bug, 1572
@bender-ckeditor-plugins: wysiwygarea,toolbar,widget,undo,basicstyles,sourcearea,codesnippet,image2

1. Place the caret in the empty paragraph between the two widgets.
1. Hit the <kbd>backspace</kbd> key.

  **Expected:**

  * The empty paragraph is removed and the **first** widget is selected.
  * No visible characters are deleted (use source mode to verify).
  * There is an undo step created.

  **Unexpected:** The empty paragraph was not removed.

1. Press the `undo` button.
1. Hit the <kbd>delete</kbd> key.

  **Expected:**

  * The empty paragraph is removed and the **second** widget is selected.
  * No visible characters are deleted (use source mode to verify).
  * There is an undo step created.

  **Unexpected:** The empty paragraph was not removed.
