@bender-ui: collapsed
@bender-tags: bug, 547, 4.14.0
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath, image, link

## Important:
**After each scenario use `undo` button to revert editor to the basic state.** Observe if undoing works correctly.

For each scenario **Expected** and **Unexpected** results are the same:

**Expected:**
Emoji was dropped in the new location without creating additional elements (like nested table, additional row or whitespaces).

**Unexpected:**
Drop target was not droppable or some elements (mentioned above) appeared from nowhere.

## Scenarios:

1. Drag <span style="color:#59bb34">green (happy)</span> emoji to the cell 1.1.

1. Drag <span style="color:#e74433">red (angry)</span> emoji to each of the cells in the table nested in cell 3.2, then drag it to the cell 2.2.

1. Drag <span style="color:#59bb34">green (happy)</span> emoji to the table at the beginning of WYSIWYG area and back to the cell 2.1.

1. Drag <span style="color:#e74433">red (angry)</span> emoji to the table at the end of WYSIWYG area and back to the nested table.

1. Drag <span style="color:#f2c041">yellow (neutral)</span> emoji to the cell 1.1.

1. Drag <span style="color:#f2c041">yellow (neutral)</span> emoji to any cell in the nested table.

1. Drag <span style="color:#e47a3b">orange (sad)</span> emoji to the cell 1.1.

1. Drag <span style="color:#e47a3b">orange (sad)</span> emoji to any cell in the nested table.

1. Drag <span style="color:#e47a3b">orange (sad)</span> emoji to the table in second editor instance.

1. Drag <span style="color:#e74433">red (angry)</span> emoji to the table in second editor instance.

1. Last one is a little bit tricky:
  * Select text in cell 1.1.
  * Still holding mouse button move coursor to another cell and go back to cell 1.1
(the point is it should become fake selected).
  * Drag text to another cell.

  If you need there is a recording of potential bug we try to catch in this scenario:
https://github.com/ckeditor/ckeditor-dev/pull/3244#pullrequestreview-258421144.
