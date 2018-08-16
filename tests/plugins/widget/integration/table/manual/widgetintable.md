@bender-tags: 1027, 4.8.0, widget, bug
@bender-ui: collapsed
@bender-include: ../_helpers/testwidgets.js
@bender-ckeditor-plugins: undo,clipboard,basicstyles,toolbar,wysiwygarea,widget,table,resize

----

1. Try to add new widget in the table (buttons without icon in toolbar).
1. Click on the widgets in the table.
1. Try to select some text **in the table**.
1. Perform some operation on selected text (change, append new text, apply some style, etc.).

_Perform above steps for all widgets, inner and outer table, and both editors._

**Expected:** Widget is deselect when focus is changed to text in table and text selection is visible. You are able to perform operations on selected text.

**Unexpected:** Widget preserve focus even tough some text in the table is selected. You cannot modify selected text in such case.
