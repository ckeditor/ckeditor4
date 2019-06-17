@bender-tags: 4.10.1, bug, emoji, 2195
@bender-ckeditor-plugins: wysiwygarea, sourcearea, emoji
@bender-ui: collapsed

## For both editors:

1. Place caret at the end of first line.

1. Type ':bu' without space before.

1. Type ' :bu' with space.

1. Place caret at the end of second line and repeat step 2.

### Expected

- Nothing happens when there is no preceding space.
- When there is preceding space or it is beginning of line emoji suggestion box appears.

### Unexpected

- Emoji suggestion box appears when there is no preceding space.

----
## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
