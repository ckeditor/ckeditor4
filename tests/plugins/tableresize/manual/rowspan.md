@bender-ui: collapsed
@bender-tags: bug, 3961, 4.15.1
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tableresize, basicstyles, undo, sourcearea, tableselection

1. Resize merged cell starting from both left and right.

  **Expected** Vertical pillar is correctly rendered during resize.

  **Unexpected** Vertical pillar is much wider than expected or it's impossible to resize cell.

2. Focus merged cell multiple times by clicking near cell borders.

  **Expected** It's possible to focus cell.

  **Unexpected** Clicking renders resizing pillar preventing cell focus.

3. Play a bit with row span in different cell range and check if it resizes properly.
