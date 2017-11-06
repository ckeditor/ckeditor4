@bender-tags: 1027, 4.8.0, widget
@bender-ui: collapsed
@bender-include: ../_helpers/testwidgets.js
@bender-ckeditor-plugins: undo,clipboard,basicstyles,toolbar,wysiwygarea,widget,table,resize

----

1. Try to add new widget in table ( buttons without icon in toolbr ).
1. Click on the widgets in table.
1. Try to select some text **in table**.
1. Perform some operation on selected text ( change, append new text, apply some style, etc. ).

_Perform above steps for all widgets, inner and outer table, and both editors._

**Expected:** Widget is deselect when focus is changed to text in table and text selection is visible. You are able to perfom operatons on selected text.

**Unexpected:** Widget preserve focus even tough some text in table is selected. You cannot modify selected text in such case.
