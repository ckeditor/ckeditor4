@bender-tags: 4.19.0, feature, 4986
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, sourcearea, stylescombo, font

1. Toggle source area.
1. Place cursor at the end of the editable area.
1. Type some text.

## Expected

* Typed text keeps formatting of the previous paragraph.
* There are exactly 3 visual line breaks.

## Unexpected

* Typed text has no formatting.
* There is more or less visual line breaks.
