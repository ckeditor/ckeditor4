@bender-ui: collapsed
@bender-tags: 4.10.0, bug, 620
@bender-ckeditor-plugins: wysiwygarea,toolbar,undo,basicstyles,font,stylescombo,format,blockquote,list,table,elementspath,justify,clipboard,link,pastetext

## Instruction:

Perform below scenario for 2 cases:
- inside single editor
- between editors

## Test Scenario

1. Copy and paste rich content, containing some styling.


**Expected:**
* `forcePasteAsPlainText=false` - when styled text is paste, text formatting is preserved.
* `forcePasteAsPlainText=true` - when styled text is paste, text formating is lost. Only plain text is copied to editor.
