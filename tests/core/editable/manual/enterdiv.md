@bender-tags: 4.12.0, bug, 2751
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, sourcearea, div, selectall, elementspath

## For each editor

1. Select all.
1. Copy.
1. Paste.
1. Go to source.

## Expected

Editor content looks same as before pasting which is listed above editor.

## Unexpected

Pasted content is wrapped with an extra `div` element.

## Note

There is an upstream issue caused by buggy selection. It occurs when div is nested in another div.
So these cases are excluded from test on following browsers:

- IE8
- [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=931285)
- [Safari](https://bugs.webkit.org/show_bug.cgi?id=198603)
