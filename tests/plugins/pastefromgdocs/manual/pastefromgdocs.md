@bender-tags: feature, 4.13.0, 835, pastetools
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromgdocs, sourcearea, elementspath, basicstyles, format, link, image2, autolink, colorbutton, stylescombo, font, justify, pagebreak, list

Perform these steps for every editor:

1. Copy some GDocs document.
2. Paste it into the editor.

### Expected

Pasted content looks the same as the content inside GDocs.

### Unexpected

* Pasted content is formatted different than the content inside GDocs.
* Pasted content is bolded.
