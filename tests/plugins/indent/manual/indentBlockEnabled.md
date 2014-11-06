@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, list, indentlist, indentblock

1. Put caret at the first item in the first list.
2. Click `indent` button at the toolbar.

**Expected:** Whole list should be indented.

----

1. Put caret at the second item in the first list.
2. Click `indent` button at the toolbar.

**Expected:** Only second item should be indented, but not the whole list.

----

1. Put caret at the first item in the second list.

**Expected:** Whole list should be indented.

----

1. Put caret at the second item in the second list.
2. Click `indent` button at the toolbar.

**Expected:** Only second item should be indented, but not the whole list.