@bender-ui: collapsed
@bender-tags: bug, 4.11.0, 1181
@bender-ckeditor-plugins: wysiwygarea, toolbar, contextmenu, link, clipboard

1. Open console.
2. Right click on the link without prior focusing the editor.

## Expected

Context menu does not appear.

In case of Chrome on macOS: right-clicking on link will select it and open the context menu.

## Unexpected

There is an error inside the console:

```
Uncaught TypeError: Cannot read property 'checkReadOnly' of undefined
```
