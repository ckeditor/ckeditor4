@bender-ui: collapsed
@bender-tags: 4.9.0, bug
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,image2,font,stylescombo,format,blockquote,list,table,elementspath,justify,clipboard,link,pastefromword,pastetext

## Scenario:

Perform below scenario with both HTML and Word copied content.

1. Copy some rich content.
1. Paste to each editor using all 3 paste buttons.

**Expected:**
* `forcePasteAsPlainText=false` only after _Paste as plain text_ content is pasted as plain text.
* `forcePasteAsPlainText=true` content is always pasted as plain text.
* `forcePasteAsPlainText=allow-word` only Word content after using _Paste from Word_ is pasted as rich text.

**Important:**
After pressing _Paste as plain text_ and then pasting content from Word via `Ctrl + V` it is still pasted
as rich content [#1328](https://github.com/ckeditor/ckeditor4/issues/1328).

**HTML helper:**
<div>
	<p>Foo <strong>Bar <em>Baz</em></strong></p>
</div>


