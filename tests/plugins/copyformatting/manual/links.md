@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Place cursor inside `th^is` in the first paragraph.
2. Click "Copy Formatting" button.
3. Select `{here}`.
4. Repeat the procedure for the second and third paragraph.

**Expected:**

* Styles are correctly copied from the "this" word to the "here" word.
* First and third paragraphs: the link remains undeleted.
* Second paragraph: a new link is not created.
