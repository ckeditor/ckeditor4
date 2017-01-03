@bender-tags: 4.6.1, tc, 14869
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,divarea,find,clipboard,undo,toolbar

## Scenario

1. Open the `Find` dialog.
2. Type one of the words from the editor into the _Find what_ input and click _Find_.
3. Close the dialog.

Make sure to go through this scenario with all the words.

### Expected result:

After dialog is closed, the editor is focused and the searched-for text is selected.

### Unexpected:

After dialog is closed, editor is not focused or there are errors in the console.
