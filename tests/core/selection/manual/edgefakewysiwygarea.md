@bender-tags: selection, fake, widget, 4.5.11, tc, 14831
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, placeholder, basicstyles, toolbar, floatingspace

### ONLY IN EDGE 14+

1. Click the placeholder widget.
2. Press `Ctrl+B` to bold it.

**Expected results:**

* After pressing `Ctrl+B` widget becomes bold.

**Unexpected results:**

* After pressing `Ctrl+B` "placeholder placeholder widget" is added to the editable and the selection is moved to the end of the new added text.
