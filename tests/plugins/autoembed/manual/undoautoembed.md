@bender-tags: tc, 4.5.2, 13410
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,autolink,autoembed,link

1. Copy one of the test URLs.
1. Press CTRL+V to paste it into editor.
1. Press CTRL+Z to undo **before** embedded content is loaded.
1. Expected: embedding process should not be performed, pasted link should be removed.
