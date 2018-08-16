@bender-tags: 4.10.0, bug, 1034, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, link, floatingspace, elementspath

For each editor:

1. Run JAWS.
1. Focus the editor.
1. Press enter twice.

## Expected

Two paragraphs are created. No beep sound can be heard.

## Unexpected

Only one paragraph is created. Beep sound is heard, telling JAWS left forms mode.
