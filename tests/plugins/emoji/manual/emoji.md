@bender-tags: 4.10.0, feature, emoji, 1746
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed

## Test case #1:
1. Insert new emoji by typing its name in editor. You need to type `:` colon and at least 2 characters of emoji name in editor to get suggestion box open. E.g. `:fa`.

## Test case #2:
1. Copy-paste emoji. You can use table below test cases.

## Test case #3:
1. Move selection to `Formatted` section.
2. Try to type emoji inside formatted text element.
3. Move selection `Computer code` section.
4. Try to type emoji inside code element.

### Expected TC#3:
In both cases emoji should remain not transformed. Autocomplete menu shouldn't be visible.

----
## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
