@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Place cursor inside `he^re`.
2. Click "Copy Formatting" button.
3. Click on `Co^py` to place the formatting.

**Expected:**

Link or any formatting is not being applied.

## TC2

1. Place cursor inside `Co^py`.
2. Click "Copy Formatting" button.
3. Click on `he^re` to place the formatting.

**Expected:**

Link should not be removed.