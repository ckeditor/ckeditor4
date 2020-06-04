@bender-tags: bug, editor, trac13884, 4.5.7
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, table, tabletools, floatingspace, toolbar, sourcearea, sourcedialog, elementspath, wysiwygarea

----

1. Select whole table with a mouse and Press `CTRL+C` (You can also use Copy from context menu)
2. Press `CTRL+V` or right-click after "Paste here:" and select Paste (`CTRL+V` into paste dialog and click OK)

**Expected:** The whole table is pasted properly.

**Unexpected:** Only first cell is pasted.
