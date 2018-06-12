@bender-tags: 4.8.0, trac16893, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language, stylescombo, format, colorbutton, font

# Test scenario:

Open web inspector, for each button in menu find it's 'a' element and search for `aria-haspopup` attribute.

## Expected:

`aria-haspopup` value should be exact match to following:

- for `language` value should be `menu`,
- for `styles`, `format`, `font`, `font size`, `text color` `background color` value should be `listbox`.

## Unexpected:

Any other value, or attribute missing.

