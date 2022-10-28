@bender-tags: 4.20.1, bug, 4802
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, floatingspace

1. Open anchor dialog.
2. Try to add an anchor that contains a space eg. `Foo bar`.

**Expected:** Alert popups with the information: `Anchor name cannot contain whitespaces`.

**Unexpected:** Anchor was added to the editable.
