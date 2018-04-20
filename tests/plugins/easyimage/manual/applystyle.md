@bender-tags: 4.10, feature, 1566
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, easyimage, sourcearea

Testing integration of `CKEDITOR.style` with `easyimage` widgets

# Things to test:
- Adding various styles
- Adding and removing classes
- Styling as 'Side Image' or 'Full Size Image' with balloon toolbar
- Source mode
- Cut and paste

## Expected:
- Styles are added to widget and reflected in source mode
- Turning on 'Side Image' or 'Full Size Image' with balloon toolbar work without any interferences to extra styling
- After cutting and pasting widget styles are the same as before

## Unexpected:
- Styles/classes are not applied
- Styles/classes are not reflected in source mode
- Buttons in balloon toolbar don't work

### Note:
- You need to focus widget not editable to apply any style
- Font style will add/remove class `font_big` or `font_italic` not inline styles.
