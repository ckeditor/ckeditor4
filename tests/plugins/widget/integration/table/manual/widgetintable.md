@bender-tags: 1027, 4.8.0, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: undo,clipboard,basicstyles,toolbar,wysiwygarea,widget,table,resize

----

1. Click into widgets in table
1. Try to select some text **in table**
1. Perform some operation on selected text ( change, append new text, apply some style, etc. )
1. Check behaviour inside inner and outer table depend of testing widget
1. Try to add new widget in table ( buttons without icon in toolbr )

_Perform above steps for all widgets and both editors._

**Expected:** Widget is deselect when focus is changed to text in table. You are able to perfom operatons on selected text.

**Unexpected:** Widget preserve focus even tough some text in table is selected. You cannot modify selected text in such case.
