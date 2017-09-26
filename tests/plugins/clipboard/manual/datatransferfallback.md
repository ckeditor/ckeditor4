@bender-ui: collapsed
@bender-tags: 4.8.0, feature, 468, 962
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, clipboard, floatingspace, sourcearea, htmlwriter, link, placeholder

_Open dev console as events are logged there._

## Test D&amp;D and copy/paste:
 * internally (same editor),
 * between editors,
 * externally (helpers, MS Word, etc).

## using content like:
 * simple text,
 * table cell/cells,
 * link,
 * helpers textarea content,
 * helpers html content,
 * content from MS Word,
 * widgets (inline and block).

## Expected:
 * Events sequence caused by one action (e.g. `drag`, `drop`, `paste` for internal drag) always have the same `DataTransfer id`.
 * `Id storage` (if present) should be `text/html` for `Edge` browser and `cke/id` for other browsers.
 * Check also:
  * proper drop position,
  * in the internal and cross editor D&D, dragged content should be removed,
  * no content lost (e.g. ids of anchors),
  * undo should work properly,
  * widget (both block and inline) D&amp;D works only internally in one editor,
  * no crashes, nor errors.
