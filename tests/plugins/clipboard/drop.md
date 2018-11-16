@bender-tags: 4.6.2, 4.7.3, 4.8.0, 4.9.2, 4.10.1, 4.11.1, bug, clipboard, 2595
@bender-ckeditor-plugins: clipboard

1. Fully select any inline (`<a>`, `<strong>`, etc.) wrapped content, eg. `aaa <strong>[bbb]</strong> ccc`.
2. Drag selection to the boundaries of the editor; somewhere that's invalid, but within the editor. Works best using the nearest border.
3. Release mouse.

## Expected

Content in dragged selection should remain in DOM, eg. `aaa <strong>[bbb]</strong> ccc`.

## Unexpected

Content in dragged selection is removed from DOM, eg. `aaa ccc`.

Error is thrown in console:
```
Uncaught TypeError: Cannot read property 'type' of null
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.setStart (ckeditor.js:165)
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.setStartAfter (ckeditor.js:166)
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.setStartAt (ckeditor.js:167)
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.moveToPosition (ckeditor.js:164)
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.splitElement (ckeditor.js:170)
at ckeditor.js:386
at $.insertHtml (ckeditor.js:354)
at $. (ckeditor.js:364)
at a.d (ckeditor.js:10)
at a. (ckeditor.js:11)
```