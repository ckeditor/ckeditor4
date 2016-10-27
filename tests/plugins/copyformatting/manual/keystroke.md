@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Place cursor inside styled part of text.
2. Press `Ctrl + Shift + C`.
3. Click inside or select (with mouse or with keyboard) other, unstyled part of text.
4. Press `Ctrl + Shift + V`.

**Things to check**

* Button changes its state to "On" after copying styles.
* Styles are copied correctly.
* All text styles should be copied (text decoration, style, weight, color, background color).
* All attributes should be copied.
* Newly applied styles should overwrite existing styles.
* Style copied with `Ctrl + Shift + C` could be pasted multiple times by pressing `Ctrl + Shift + V`.
* Copying can be cancelled by pressing `Escape` key.
* Button changes its state to "Off" after pressing `Escape` key.
* The cursor is not changed.
* If the styles are copied from unstyled element, the formatting is removed from target element.

