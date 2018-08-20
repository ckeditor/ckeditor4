@bender-ui: collapsed
@bender-tags: bug, 4.10.1, 1181
@bender-ckeditor-plugins: wysiwygarea, toolbar, contextmenu, link, clipboard

**Test Scenario**

1. Open console.
2. Right click on the link without prior focusing the editor.

**Expected**

Context menu does not appear.

**Unexpected**

There is an error inside the console:

```
Uncaught TypeError: Cannot read property 'checkReadOnly' of undefined
```
