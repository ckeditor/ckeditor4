@bender-tags: feature, 4.13.0, 835, pastetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastetools, sourcearea, elementspath, basicstyles, format, link

Perform these steps for every editor:

1. Open console.
2. Copy some rich text / html.
3. Paste it into the editor.

### Expected

* There are two messages inside the console (order is not important):
	* `'filter1.js is loaded!'`
	* `'filter2.js is loaded!'`
* `<p><strong>SURPRISE!</strong></p>` is pasted into the editor.

### Unexpected

* There are errors inside the console, especially ones connected with non-existent files.
* Content is not pasted or is pasted untransformed.
