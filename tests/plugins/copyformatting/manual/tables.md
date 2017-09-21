@bender-ui: collapsed
@bender-tags: bug, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, table, tabletools, undo

**Procedure**

Play with tables.

**Things to check**

* Styles are applied correctly even in the mixed context (e.g. selection begins in a paragraph and ends in a table).
* Styles from table cells (background color) and headings (background color and color) are applied only to table cells or headings. Mind that bold font in headings is a part of default browser's styles and won't be copied to the table cells.
* Only inline styles are applied to the text.
* The table is not splitted into two after applying styles.
