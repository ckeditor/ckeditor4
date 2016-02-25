@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Place cursor inside styled part of text.
2. Click "Copy Formatting" button in the toolbar.
3. Click inside or select with mouse other, unstyled part of text.
4. Repeat the procedure, but instead of clicking, double click the button to switch into "sticky" mode.

**Things to check**

* Styles are copied correctly while using only mouse.
* Copying can be cancelled by clicking "Copy Formatting" button.
* All text styles should be copied (text decoration, style, weight, color, background color).
* All attributes should be copied.
* The cursor is changed when the style is copied and restored when the style is applied.

**Things to check in sticky mode**

* Styles can be applied to many elements.
* The sticky mode can be switched off by clicking "Copy Formatting" button.
* The button's state is not changed after applying styles.
* The curso is restored only after clicking the button.

