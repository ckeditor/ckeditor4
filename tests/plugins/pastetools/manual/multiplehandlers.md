@bender-tags: feature, 4.13.0, 835, pastetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastetools, sourcearea, elementspath, basicstyles, format, link

Perform these steps for every editor:

1. Open console.
1. Copy some rich text / html.
2. Paste it into the editor.

### Expected

* Pasted content is replaced with `<p><em>Oh yes!</em></p>`.
* There are two `Paste handler #<number> activated` messages inside the console (one for paste handler #1 and one for paste handler #2).

### Unexpected

* Pasted content is replaced with `<p><strong>Oh no!</strong></p>`.
* Pasted content is not transformed at all.
* There are less or more than two `Paste handler #<number> activated` messages inside the console.
