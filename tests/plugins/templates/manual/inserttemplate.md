@bender-tags: 4.17.0, feature, 4850
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog, templates, image, table, format, basicstyles

## Insert template at the cursor position

1. Find `I want my template here -><-` text.
2. Place the cursor between `->` and `<-`.
3. Click the `Templates` Button.
4. Deselect the checkbox at the top.
5. Choose the template `Some text`.

**Expected:** The paragraph with the text `I am a text` followed by a second paragprah with the text `Here is some more text` will be inserted between `->` and `<-`.

**Unexpected:** The whole content of the editor will be replaced by the template.

## Insert template file at the cursor position

1. Find `I want my secon template here -><-` text.
2. Place the cursor between `->` and `<-`.
3. Click the `Templates` Button.
4. Deselect the checkbox at the top.
5. Choose the template `Title and Text`.

**Expected:** The heading `I am a title` and the text `I am a text` will be inserted between `->` and `<-`.

**Unexpected:** The whole content of the editor will be replaced by the template.
