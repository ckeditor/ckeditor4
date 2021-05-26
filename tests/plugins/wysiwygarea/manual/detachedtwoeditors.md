@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Bold the entire text in "Static editor".

2. Write another line of text in "Static editor".

2. Underline the entire text in "Detachable editor".

3. Reattach editor with double click on "Toggle" button.

  **Expected:**

  * "Detachable editor" shows up with its own underlined text.
  * "Detachable editor" has its own undo history.
  * "Detachable editor" is editable.
  * Elementspath (bottom bar) is filled after focusing the editor.

  **Unexpected:**

  * Editor data is lost.
  * Content area is not editable.
  * "Detachable editor" has the same data as "Static editor".
  * "Detachable editor" undo steps lead to the same results as in "Static editor".
