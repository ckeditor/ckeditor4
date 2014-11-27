@bender-tags: 4.4.6, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, clipboard, enterkey, htmlwriter, list, indentlist, sourcearea

General note: In this test case only indentlist plugin is enabled (indentblock is disabled).

----

1. Put caret at the first item in the first list.

**Expected:** Indent button should be disabled.

----

1. Put caret at the second item in the first list.
2. Click `indent` button at the toolbar.

**Expected:** Only second item should be indented, but not the whole list.

----

1. Put caret at the first item in the second list.

**Expected:** Indent button should be disabled.

----

1. Put caret at the second item in the second list.
2. Click `indent` button at the toolbar.

**Expected:** Only second item should be indented, but not the whole list.