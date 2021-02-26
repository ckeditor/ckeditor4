@bender-tags: 4.17.0, bug, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track eventual errors.

1. Write the same text in both editors.

2. Change style of written text to "Heading 1" in both editors.

3. Switch to "Source Mode".

4. Add `<p>Another</p>` text.

5. Switch back from "Source Mode".

3. Reattach editor with double click on "Toggle" button.

  **Expected:**

  * Editor shows with same data.
  * Content is editable.
  * Elementspath (at the bottom is updated).

  **Unexpected:** Editor data is lost, content area is not editable.
