@bender-tags: bug, 4.7.3, word
@bender-ui: collapsed
@bender-ckeditor-plugins: pastefromword,toolbar,basicstyles,wysiwygarea,sourcearea

----
1. Open [docx file](https://github.com/ckeditor/ckeditor-dev/blob/master/tests/plugins/pastefromword/generated/_fixtures/Enter_BR/Enter_BR.docx) in Microsft Word.
1. Copy text from file and paste it to editor.
1. Check Source in editor.

**Expected:** There is no `<p>` tags in source. Every pparagraph is replaced wit `<br />`.

**Unexpected:** There are `<p>` tag after paste.


