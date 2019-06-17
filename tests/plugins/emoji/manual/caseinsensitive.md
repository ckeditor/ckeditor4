@bender-tags: 4.10.1, bug, emoji, 2167
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo
@bender-ui: collapsed

Type in editor various upper and lower-cased combinations:
1. `:OK`,
1. `:ok`,
1. `:oK`.

## Expected:

Every time same emojis appear, including: `:OK_button:`, `:OK_hand:`, `:Tokyo_tower`.

## Unexpected:

- Shown emojis are different when letters are lower and upper-cased.
- No emojis are shown when typing `:oK`.

## Further testing:

You should be able to type any other emoji names with upper or lower-case.

## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
