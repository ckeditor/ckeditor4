@bender-tags: bug, 4.10.1, 1084
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, sourcearea
@bender-ui: collapsed

Do following steps for both text color button and background color button.

1. Select word 'text'.
1. Press text color button.
1. Set any of colors other than automatic.
1. Press text color button again.
1. Set color to 'automatic'.
1. Press source button.

## Expected

Html in source mode matches following:
`<p>Test text</p>`

## Unexpected

Html in source mode has span with color `null`, eg.:

`<p>Test <span style="color:null">text</span></p>`
