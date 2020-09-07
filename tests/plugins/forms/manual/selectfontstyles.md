@bender-tags: editor, bug, 4.15.0, 4141
@bender-ui: collapsed
@bender-ckeditor-plugins: forms, wysiwygarea, toolbar, font
----

1. Select all content inside the editor.
2. Change font family to "Comic Sans MS".

### Expected

Heading's font changed.

### Unexpected

Heading's font didn't change.

### Note

In IE selection after applying font styles can become broken and some errors will be shown in the console. Despite it everything seems to work.
