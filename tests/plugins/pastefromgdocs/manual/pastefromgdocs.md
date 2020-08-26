@bender-tags: 4.13.0, 835, pastetools, feature, generic
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromgdocs, sourcearea, elementspath, basicstyles, format, link, image2, autolink, colorbutton, stylescombo, font, justify, pagebreak, list, liststyle, tabletools, floatingspace, resize

Perform these steps for every editor:

1. Copy some GDocs document (<a href="https://docs.google.com/document/d/14AzrpfBqjAVDCpVAGdOusz2QE8rFR48-dgLMryFm024/edit" target="_blank">CKE4 sample</a>, <a href="https://docs.google.com/document/d/1a9YzJidjxRPrxY9BL4ZReNFkPAgd_ItnZoFxcjSiJ4U/edit" target="_blank">CKE5 sample</a>).

	**Note:** although older IEs (below version 11) are not supported by Google Docs, you can open the document in supported browser and copy the content from it.
2. Paste it into the editor.

### Expected

Pasted content looks the same as the content inside GDocs.

### Unexpected

* Pasted content is formatted different than the content inside GDocs.
* Pasted content is bolded.
