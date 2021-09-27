@bender-ui: collapsed
@bender-tags: 4.17.0, bug, 4858
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, elementspath, autolink

Paste the given URL to the editor and check whether it's turned into a link.

## Expected

Link is pasted as it is, without additional encoding.

## Unexpected

Special `&` characters are additionaly encoded to `&amp;`.
