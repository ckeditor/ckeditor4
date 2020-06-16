@bender-ui: collapsed
@bender-tags: 4.5.0, 4.5.2, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image2, font, stylescombo, basicstyles, format, maximize, blockquote, list, table, resize, elementspath, justify, clipboard, floatingspace, sourcearea, htmlwriter, link, uploadimage, image2, pastefromword
@bender-include: ../../uploadwidget/manual/_helpers/xhr.js

## Scenarios:

 * copy and paste simple text (textarea),
 * copy and paste HTML content of the webpage,
 * copy and paste content from MS Word,
 * copy and paste file (works only on Firefox),
 * copy and paste part of the image from the image editor,
 * copy and paste internal HTML,
 * copy and paste text from another editor,
 * copy and paste HTML from other browser (the same OS).

## Notes:

### General:

* For data type `Files` no data is logged.
* Everything should works as described in [this research](https://dev.ckeditor.com/ticket/11526#comment:7) or better.

### Safari

* There's no `text/html` data for external paste. Hence, pastebin is used. Hence, data type always equals `html` (see: [`config.clipboard_defaultContentType`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-clipboard_defaultContentType)).
* Content pasted from Word isn’t cleaned as well as on other browsers.
* Fragment of an image is pasted as an <img> element with webkit-fake-url.

### Firefox

* There's no `text/html` data for external paste. Hence, pastebin is used. Hence, data type always equals `html` (see: [`config.clipboard_defaultContentType`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-clipboard_defaultContentType)).
* Paste is always recognized as external.

### IE

* Paste is always recognized as external.
* There's no `text/html` data for external paste. Hence, pastebin is used. Hence, data type always equals `html` (see: [`config.clipboard_defaultContentType`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-clipboard_defaultContentType)).
* IE8-9: No support for files. (TODO: waiting for upload image to verify how it works on IE10-11 - can you paste files?).

### Chrome Android

* Paste is always recognized as external.

