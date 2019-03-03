@bender-tags: 4.11.4, justify, bug, 1479
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea, elementspath, sourcearea, font, list

**NOTE**: Repeat test steps for both editors.

# Test case 1:
1. Put cursor in the first line.
2. Align text to the center.
## Expected:
Justification is avialable and text is moved to the center.
## Unexpected:
Justification icons are disabled

# Test Case 2:
1. Move cursor to the first list item.
2. Select `<ul>` tag from elementspath
3. Elementspath **must** show path like `body > ul`, without `li` at the end. If path still shows `li` items, then ignore this test case. (This behaviour can be observed in Safari browser)
## Expected:
Justification is disabled when `<ul>` tag is selected.
