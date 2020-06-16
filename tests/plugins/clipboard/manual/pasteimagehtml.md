@bender-ui: collapsed
@bender-tags: 3585, 3625, 4.13.1, bug, clipboard
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

## Scenario
1. Copy content from document.
2. Paste into the editor.

### Expected

Content is pasted as text/HTML.

### Unexpected

Content is pasted as image.

Documents to check:

* [PowerPoint one](_assets/pasteimagehtml.pptx),
* [Excel one](_assets/pasteimagehtml.xlsx).

Note: formatting is not important in this test. Only the type of pasted content is important.
