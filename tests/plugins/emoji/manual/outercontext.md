@bender-tags: 4.10.0, feature, emoji, 1746
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, divarea
@bender-ui: collapsed

1. Insert new emoji by typing its name in editor. You need to type `:` colon and at least 2 characters of emoji name in editor to get suggestion box open. E.g. `:fa`.

## Expected:
Autocomplete suggestion is displayed inside **regular** paragraph and not in paragraph inside `section`.

----
## Example emoji:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
