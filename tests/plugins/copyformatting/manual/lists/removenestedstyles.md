@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, list, indentlist, liststyle, undo

1. Put the selection in a first item of the second list, like so: `Start ^Value 5 & Upper Alpha`.
2. Click "Copy Formatting" button.
3. Click in a first item of first (formatted) list, like so `ap^ple`.

### Expected

* Only clicked list item inline styles get removed.
* Outer list markers get changed.

### Unexpected

Inline formatting in a list item ("boy" text) of the following list is removed as well.
