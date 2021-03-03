@bender-tags: 4.17.0, bug, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track eventual errors.

1. Bold the entire text in "Static editor".

2. Write another line of text in "Static editor".

2. Underline the entire text in "Detachable editor".

3. Reattach editor with double click on "Toggle" button.

  **Expected:**

  * "Detachable editor" shows with its own underlined text.
  * "Detachable editor" has its own undo history.
  * "Detachable editor" is editable.
  * Elementspath (at the bottom is updated).

  **Unexpected:**

  * Editor data is lost.
  * Content area is not editable.
  * "Detachable editor" has the same data as "Static editor".
  * "Detachable editor" undo steps leads to the same results as in "Static editor".
