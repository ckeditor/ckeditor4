@bender-tags: feature, 4.13.0, 835, pastetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastetools, sourcearea, elementspath, basicstyles, format, link

Perform these steps for every editor:

1. Copy some rich text / html.
2. Paste it into the editor.

### Expected in editor with registered handler

#### Editor with registered handler

Pasted content is replaced with `<p><strong>SURPRISE!</strong></p>`.

#### Editor without registered handler

Content is pasted as is.

### Unexpected

#### Editor with registered handler

Content is pasted as is.

### Editor without registered handler

Content is transformed in any way.
