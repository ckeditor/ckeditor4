@bender-tags: 4.19.0, feature, 4986
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, sourcearea, stylescombo, font, elementspath

1. Toggle source area.
2. Place cursor at the end of the editable area.

**Expected** There are exactly 3 visual line breaks.

3. Type some text.

**Expected** Typed text keeps formatting of the previous paragraph.

**Note** You can also use elementspath to see whether a selection is placed inside `span` styling elements.
