@bender-tags: 4.16.2, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog, templates, image, table, format, basicstyles

Insert template and replace all contents
========================================

1. Click the `Templates` Button.
2. Select the `insertOption` checkbox at the bottom.
3. Choose the template `Title and Text`.
 

**Expected:** The Text inside of the editor will be replaced by the heading `I am a title` and the text `I am a text`.

Insert template at the cursor position
======================================

1. Type `I want my template here -><-`.
2. Place the cursor between `->` and `<-`.
3. Click `Templates` Button.
4. Deselect the checkbox at the bottom.
5. Choose the template `Title and Text`.
 

**Expected:** The heading `I am a title` and the text `I am a text` will be inserted between `->` and `<-`.

**Unexpected:** The whole content of the editor will be replaced by the template.
