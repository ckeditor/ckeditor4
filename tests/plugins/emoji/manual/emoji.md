@bender-tags: 4.10.0, feature, emoji, 1746
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

## Test case #1:
1. Insert new emoji by typing its name in editor. You need to type `:` colon and at least 2 characters of emoji name in editor to get suggestion box open. E.g. `:fa`.

----
## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
