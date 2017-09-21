@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, basicstyles, colorbutton, font, format, sourcearea, autogrow

**Procedure:**

1. Select two or more table cells.
2. Apply one of the styles

**Expected result:**

* The styles are applied to all cells.
* The visual selection is preserved.

**Unexpected result:**

* The styles are applied to only the first cell.
* The visual selection is not preserved.
