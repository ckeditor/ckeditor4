@bender-tags: 4.11.0, feature, emoji, 2062
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed

1. Open emoji dropdown.
2. Type any search string
### Expected: Emoji result are narrowed down to proper match
3. Type search string 'kebab'
### Expected: Emoji are narrowed down to 2 results ( `oden` and `stuffed_flatbread` ) based on keywords. Empty sections are removed.
4. Click outside of emoji dropdow ( or press <kbd>ESC</kbd> ) to close it and open it again
### Expected: Search result should be cleared out and all emoji should be displayed.
