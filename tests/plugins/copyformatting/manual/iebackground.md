@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo

**Procedure:**

1. Click inside one of the two first paragraphs (without styles or with only font's styles).
2. Click "Copy Formatting" button.
3. Select some text with the background to apply styles there.

**Expected:**

* Styles are applied correctly.
* Background is stripped only from the selected text.

**Unexpected:**

* Text becomes invisible and the background is still present.
* Background is stripped from the whole paragraph.
