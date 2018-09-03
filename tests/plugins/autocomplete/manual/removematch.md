@bender-tags: 4.10.2, bug, 2194
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Open the console.
1. Focus the editor.
1. Type `@`.
1. Accept `@anna` dropdown option.
1. Start deleting inserted match using `backspace` key.

## Expected

No console errors.

## Unexpected

Console error:

```
Uncaught DOMException: Failed to execute 'setEnd' on 'Range': The offset 2 is larger than the node's length (1).
at window.CKEDITOR.window.CKEDITOR.dom.CKEDITOR.dom.range.getClientRects
```
