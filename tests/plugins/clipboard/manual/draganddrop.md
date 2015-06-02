@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, clipboard, floatingspace, sourcearea, htmlwriter, link

 * test internal D&amp;D in the editor,
 * dropping content from an external source (helpers, MS Word),
 * test D&amp;D between editors.

Expected behavior:
------------------
 * proper drop position,
 * in the internal and cross editor D&D: dragged content should be removed,
 * no content lost (e.g. ids of anchors),
 * paste event should be fired,
 * undo should work properly (one undo operation for one D&D),
 * no crashes, nor errors.

Drag scenarios:
---------------
 * drag simple text,
 * drag table cell/cells,
 * drag link,
 * drag helpers textarea content,
 * drag helpers html content,
 * drag content from MS Word,
 * drag widget (inline and block).

Drop scenarios:
---------------
 * drop in the different paragraph (before and after),
 * drop in the same paragraph (before and after),
 * drop in the same text node (before and after),
 * drop between text lines,
 * drop on the whitespace next to the header,
 * drop on the whitespace on the left side from the quote,
 * drop into a cell.

**Note:** internal D&amp;D is the most complex operation because editor have to handle two ranges at the same time.

**Note:** that block widget D&amp;D works only internally in one editor.