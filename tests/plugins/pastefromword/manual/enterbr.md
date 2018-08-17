@bender-tags: bug, 4.7.3, word
@bender-ui: collapsed
@bender-ckeditor-plugins: pastefromword,toolbar,basicstyles,enterkey,wysiwygarea,sourcearea

----
1. Open [docx file](../generated/_fixtures/Enter_BR/Enter_BR.docx) in Microsft Word.
1. Copy text from file and paste it to editor.
1. Check Source in editor.

**Expected:** There is no `<p>` tags in source. Every paragraph is replaced with `<br />`.

**Unexpected:** There are `<p>` tag after paste.


