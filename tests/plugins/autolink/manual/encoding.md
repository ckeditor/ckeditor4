@bender-ui: collapsed
@bender-tags: 4.17.0, bug, 4858
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, elementspath, autolink, sourcearea, htmlwriter

Paste the given URL to the editor and check whether it's turned into a link. Make sure to also confirm links in source area.

## Expected

**Editor:** Link is pasted as it is, without additional encoding.

**Source area:** `&` characters are single encoded with `&amp;`.

## Unexpected

**Editor:** Special `&` characters are additionaly encoded to `&amp;`.

**Source area:** `&` characters are double encoded to `&amp;amp;`.
