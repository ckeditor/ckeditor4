@bender-tags: 4.14.0, 4.10.1, bug, 1115
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath, sourcearea

----

### Repet steps for both editors.

1. Select some text
1. Apply different font face
1. Check source
1. Get back to wysiwyg
1. Apply different font size
1. Check source

**Expected:** `<font>` tag occures in source.

**Unexpected:** `<span>` tag occures in source.
