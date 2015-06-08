@bender-ui: collapsed
@bender-tags: 4.5.0, tc
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, clipboard, floatingspace, sourcearea, htmlwriter, link, uploadimage, image2
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

 * test internal copy&paste in the editor,
 * test pasting content from an external source (helpers, MS Word, image editor),
 * test copy&paste between editors.

## Scenarios:

 * copy and paste simple text (textarea),
 * copy and paste HTML content of the webpage,
 * copy and paste content from MS Word,
 * copy and paste file (works only on Firefox),
 * copy and paste part of the image from the image editor,
 * copy and paste internal HTML,
 * copy and paste text from another editor.

Everything should works as described in [this research](http://dev.ckeditor.com/ticket/11526#comment:7) or better.