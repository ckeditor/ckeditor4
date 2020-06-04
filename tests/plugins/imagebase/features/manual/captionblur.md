@bender-tags: 4.9.0, bug, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, imagebase, link, htmlwriter, elementspath, easyimage

## Caption - blurring widget

1. Focus the **widget**, so that caption placeholder text appears.
1. Click outside of the editor, so that it losses the focus.

### Expected

Caption placeholder is removed.

### Unexpected

Caption placeholder is still visible.

## Caption - blurring editable

1. Focus the widget, so that caption placeholder text appears.
1. Focus caption editable, so that the text is hidden and edit caret appears.
1. Click outside of the editor, so that it losses the focus.

### Expected

Caption placeholder is removed.

### Unexpected

Caption is visible. Text might be removed, but there's still one line of extra height below the image.

---

Repeat above tests with the "Divarea" editor.
