@bender-tags: 4.10.1, bug, 2107
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

----

## For each editor

1. Focus editor and type `@`.
1. Click and hold mouse button on first dropdown. Release it after 2 seconds.

### Expected

Item is inserted into editor.

### Unexpected

Dropdown disappears without inserting item into editor.
