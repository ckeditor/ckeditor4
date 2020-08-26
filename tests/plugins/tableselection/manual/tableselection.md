@bender-ui: collapsed
@bender-tags: tableselection, feature, generic
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, link, basicstyles, sourcearea, elementspath, undo, autogrow, enterkey

Have fun with visual table selection!

**Things to check:**

* Selecting one cell by mouse should not activate visual selection.
* Clicking on elements path should also trigger a visual selection.
* New selection should dismiss the previous one.
* The visual selection should behave in the same way as the native one in Firefox.
* Real selection is not visible.
* Visual selection does not create any undo/redo step.

**Known problems:**

* The real selection is still visible in Firefox.
