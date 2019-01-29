@bender-tags: 4.11.3, justify, bug, 1479
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea, elementspath, sourcearea, font, list

# Test case 1:
1. Repeat steps in both editors.
2. Put cursor in first line.
3. Align text to center.
## Expected:
Justification is avialable and text is moved to the center.
## Unexpected:
Justification icons are disabled

# Test Case 2:
1. Repeat steps in both editor.
2. Move cursor to list item.
3. Select `<ul>` tag from elementspath
4. Elementspath **must** show path like `body > ul`, without `li` at the end. If path still shows `li` items, then ignore this test case. (This behaviour can be observed in Safari browser)
## Expected:
Justification is disabled when `<ul>` tag is selected.
