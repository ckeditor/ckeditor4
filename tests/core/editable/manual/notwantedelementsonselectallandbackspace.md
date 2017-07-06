@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: format, stylescombo, toolbar, wysiwygarea, undo

----

1. Focus editor.
2. Select whole text using shortcut.
3. Press `Backspace` or `Delete`.

**Expected result:** There should be no `<small>` element in result and bogus `<br>` should be present.
**Please note:** There might be either an `<h1>` element or a `<p>` in an editable.
