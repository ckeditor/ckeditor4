@bender-tags: 4.10.0, feature, emoji
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, format, stylescombo
@bender-ui: collapsed

1. Set up format: `Formatted`
2. Try to type emoji as formatted text.
3. Set up style `Computer code`
4. Try to type emoji as computer code

**Expected:** In both cases emoji should remain not transformed. Autocomplete menu shouldn't be visible.


Example emoji:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
