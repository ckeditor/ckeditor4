@bender-tags: 4.11.3, justify, bug, 1479
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea, elementspath, sourcearea, font, list

1. Put cursor in first line.
2. Align text to center.
## Expected:
Justification is avialable and text is moved to the center.
## Unexpected:
Justification icons are disabled


3. Move cursor to list item.
4. Select `<ul>` tag from elementspath
## Expected:
Justification is disabled when `<ul>` tag is selected from.


5. Repeat steps 1-4 for second editor.
