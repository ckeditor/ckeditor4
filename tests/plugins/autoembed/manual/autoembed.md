@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,image2,embed,autolink,autoembed,link

Play with the Auto Media Embed plugin.

Things to check:

* Breaking the link in two before it's embedded.
* Deleting the link before it's embedded.
* Other content changes.
* Pasting more complex content (only single links should be embedded).
* Undo/redo. Note: There should be two steps &ndash; one reverting autoembed and one reverting link paste.