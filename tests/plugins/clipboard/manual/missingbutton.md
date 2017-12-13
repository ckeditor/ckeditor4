@bender-tags: bug, 4.8.1, 595
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, clipboard, floatingspace, htmlwriter

1. Open dev console.

## Expected

No error is thrown.

## Actual

The `plugin.js:588 Uncaught TypeError: Cannot read property '_' of undefined` error is logged.
