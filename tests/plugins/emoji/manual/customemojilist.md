@bender-tags: 4.10.0, feature, emoji, 2036
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo
@bender-ui: collapsed
@bender-include: ../_helpers/tools.js

1. Insert new emoji by typing its name in editor. There should be only one emoji available (`:star:`). _You need to type at least 2 characters from emoji name to see suggestion box with emoji._

## Expected:
**Only** `:star:` emoji is available to insert in editor. Other emojis are not converted.

## Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |

