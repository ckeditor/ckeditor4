@bender-tags: tc, 4.7.0, 16825,
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, floatingspace, about, elementspath

## Test scenario

Focus the editor and press any key

## Expected

Editor gets blurred, destroyed and there are no errors in the console.

## Unexpected

There is a `Cannot read property 'isInline' of null` error in the console.
