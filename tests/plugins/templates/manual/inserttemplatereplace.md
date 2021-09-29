@bender-tags: 4.17.0, feature, 4850
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog, templates, image, table, format, basicstyles

## Insert template and replace all contents

1. Click the `Templates` Button.
2. Select the checkbox at the top.
3. Choose the template `Some text`.

**Expected:** The text inside of the editor will be replaced by a paragraph with the text `I am a text` followed by a second paragprah with the text `Here is some more text`.

## Insert template file and replace all contents

1. Click the `Templates` Button.
2. Select the checkbox at the top.
3. Choose the template `Title and Text`.

**Expected:** The text inside of the editor will be replaced by the heading `I am a title` and the text `I am a text`.
