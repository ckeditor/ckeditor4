@bender-tags: 4.11.3, bug, 2751
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, sourcearea, div, selectall, elementspath

1. Select all.
1. Copy.
1. Paste.
1. Go to source.

## Expected

Editor content looks same as before pasting which is:
```
<div>This is some sample text.</div><div>New line.</div>
```

## Unexpected

Pasted content is wrapped with an extra div:
```
<div><div>This is some sample text.</div><div>New line.</div></div>
```
