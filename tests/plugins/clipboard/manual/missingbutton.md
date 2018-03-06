@bender-tags: bug, 4.9.0, 595
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter

1. Open dev console.

## Expected

No error is thrown.

## Unexpected

The `plugin.js:588 Uncaught TypeError: Cannot read property '_' of undefined` error is logged.
