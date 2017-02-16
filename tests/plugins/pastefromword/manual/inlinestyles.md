@bender-tags: tc, 4.7.0, pastefromword, 16847
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, colorbutton, font, liststyle, table, image, pastefromword, sourcearea, htmlwriter, elementspath

1. Open [prepared Word document](../generated/_fixtures/InlineStyles/InlineStyles.docx).
2. Copy content of this file.
3. Paste content into both of editors, using the method described inside the editor.
4. Check if the original formatting from the Word is preserved, especially:
	* **font**: should be set to Verdana, size: 10pt; check especially the paragraph below the list;
	* **list**: normal list should be displayed, not replaced with `span` with some symbol at the beginning.
5. (in Chrome) Check if there is no garbage after the pasted content.
