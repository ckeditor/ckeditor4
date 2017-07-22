@bender-tags: bug, 4.5.4, trac11724
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,font,autolink,autoembed,link

For *mobile* devices:
* Tap the editable area so the software keyboard will be visible.
* Tap the Paragraph Format drop down to see styles list.
* Software keyboard should hide and the drop-down should be visible.

For *other* devices:
* Open the Paragraph Format.
* Check if it's positioned correctly.
* Resize the browser window.
* The drop-down should either hide or be repositioned correctly.
