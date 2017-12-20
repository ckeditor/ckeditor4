@bender-tags: bug, 1010, 4.8.1
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, tabletools, contextmenu, dialogadvtab

----

1. Enter source mode in editor.
2. Copy-paste table's HTML to editor. _Table's html code is located above the editor._
3. Switch to wysiwyg mode.
4. Check TD element's style.

**Expected:** Border color (red) is preserved during pasting and switching between sourcemode and wysiwygarea.

**Unexpected:** Border color has default color (grey / black). In source mode there is no border-color style.
