@bender-tags: 4.10.0, feature, emoji, 1746
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed

# Test case #1:
1. Inserting new emoji by typing it in editor.

# Test case #2:
1. Copy-paste emoji.

# Test case #3:
1. Set up format: `Formatted`.
2. Try to type emoji as formatted text.
3. Set up style `Computer code`.
4. Try to type emoji as computer code.

**Expected TC#3:** In both cases emoji should remain not transformed. Autocomplete menu shouldn't be visible.

----
Example emoji to use in tests:

| name | symbol |
| ---: | --- |
| :bug: | 🐛 |
| :winking_face: | 😉 |
| :collision: | 💥 |
| :unicorn_face: | 🦄 |
