@bender-tags: 4.11.2, bug, emoji, 2592
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../../_helpers/tools.js

## Test Case 1:

1. Open emoji dropdown.
2. Move cursor over group navigation at top of dropdown.
### Expected:
Cursor is changed to pointer, which indicates that element is a link.
3. Move cursor over emoji in main section.
### Expected:
Cursor is changed to pointer, which indicates that element is a link.

## Test Case 2:

1. Open emoji dropdown.
2. Click into navigation group.
### Expected:
Emoji list is scrolled to proper position. First element of clicked group is selected.
