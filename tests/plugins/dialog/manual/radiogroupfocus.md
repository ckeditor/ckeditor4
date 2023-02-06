@bender-tags: 4.20.2, bug, 439
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2

1. Open image dialog.
2. Move focus to `Alignment` radio group.
3. Pres `Tab` again.

**Expected:** Focus was moved outside the radio group and `Captioned image` checkbox is focused.

**Unexpected:** Focus is still in the radiogroup and the `Left` item is focused.

4. Having focus on the `Captioned image` checkbox press `Shift+Tab` key.

**Expected:** Focus was moved to the previously selected radio button.

**Unexpected:** Focus was moved to the last element of the radio group.
