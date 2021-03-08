@bender-tags: 4.16.1, feature, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo, elementspath

1. Focus the widget in the first editor.
1. Press <kbd>SHIFT + ENTER</kbd>.
1. Check the elements path (at the bottom of editor).

  **Expected:**

  * A soft break (new line without a paragraph) should be inserted after the widget.
  * Elementspath should only show `body` element.

  **Unexpected:** `<p>` or other element was inserted instead.

1. Focus the widget in the second editor.
1. Press <kbd>SHIFT + ENTER</kbd>.

  **Expected:**

  * A `<div>` element should be inserted after the widget.
  * Elementspath should show `body div` elements.

  **Unexpected:** `<p>` or other element was inserted instead.
