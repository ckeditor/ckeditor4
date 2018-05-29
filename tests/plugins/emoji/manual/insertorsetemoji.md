@bender-tags: 4.10.0, feature, emoji, 1746
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo
@bender-ui: collapsed

1. Type emoji name in input box. You can use name provided in table below.
2. Press transparent button in toolbar (they have labels). There are 2 buttons with no icon (test both of them):
  * one inserts new content in current selection,
  * second one sets entire content of a editor,

## Expected:
Emoji is properly transform from its name to symbol during insertion or setting up data in editor.

----
## Example emoji:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
