@bender-tags: 4.11.0, feature, 2072
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language, stylescombo, format, colorbutton, font

# Test scenario:

Compare `aria-haspopup` value for each button element in toolbar with expected one.

## Expected:

`aria-haspopup` value should be exact match to following:

- for `language` value should be `menu`,
- for `styles`, `format`, `font`, `font size`, `text color` `background color` value should be `listbox`.

## Unexpected:

Any other value, or attribute missing.
