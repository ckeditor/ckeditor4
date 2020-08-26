@bender-tags: feature, generic
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,autolink,autoembed,link

Play with the Auto Media Embed plugin.

Things to check:

* Breaking the link in two before it's embedded.
* Deleting the link before it's embedded.
* Other content changes.
* Pasting more complex content (only single links should be embedded).
* Undo/redo. Note: There should be two steps &ndash; one reverting autoembed and one reverting link paste.
* After pasting a link write some text **before** the content is embedded. Alternatively, simply change the selection. Check if the selection is **exactly the same** as before the insertion.
* Check if all operations are saved in undo steps (paste link, write text, insert content, write text.)
* That in the 1st editor `embed` is used and in the 2nd editor `embedsemantic` (check the data).
