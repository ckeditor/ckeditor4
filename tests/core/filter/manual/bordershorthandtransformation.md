@bender-tags: bug, 1010, 4.8.1, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, tabletools, contextmenu, dialogadvtab

----

1. Copy-paste table to editor.
2. Switch between sourcemode and wysiwyg.
3. Check TD element's style

**Expected:** Border color (red) is preserved during pasting and switching between sourcemode and wysiwygarea.

**Unexpected:** Border color is browser's defualt (grey). In source mode there is no border-color style.
