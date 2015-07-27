@bender-tags: tc, 4.5.2, 13532
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,autolink,autoembed,link

1. Copy an URL.
1. Paste it. The link becomes a widget.
1. Undo.
1. Select some text **in the editor**.
1. Copy it.
1. Paste it.
1. The text should be pasted. The link, which once was embedded (but undone) **should remain a link**.