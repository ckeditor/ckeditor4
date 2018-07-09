@bender-tags: 4.10.1, bug, emoji, 2195
@bender-ckeditor-plugins: wysiwygarea, sourcearea, emoji
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

## For both editors:

1. Place caret at the end of first line.

1. Type `:bu`.

	### Expected

	Nothing happens.

	### Unexpected

	Emoji suggestion box appears.

1. Place caret at the end of second line.

1. Type `:bu`.

	### Expected

	Emoji suggestion box appears.

	### Unexpected

	Nothing happens

----
## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
