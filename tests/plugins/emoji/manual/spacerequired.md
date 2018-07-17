@bender-tags: 4.10.1, bug, emoji, 2195
@bender-ckeditor-plugins: wysiwygarea, sourcearea, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

## For both editors:

1. Place caret at the end of line.

1. Type ':bu' without space before.

1. Type ' :bu' with space.

### Expected

When there is no space:

- Nothing happens.

When there is space:

- Emoji suggestion box appears.

### Unexpected

When there is no space:

- Emoji suggestion box appears.

----
## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
