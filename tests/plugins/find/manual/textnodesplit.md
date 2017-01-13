@bender-tags: 4.6.2, tc, 14869
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,divarea,find,clipboard,undo,toolbar

## Scenario

1. Add a new paragraph with at least two words beneath the one already present.
2. Open the `Find` dialog.
3. Type one of the newly added words from the editor into the _Find what_ input and click _Find_.
4. Close the dialog.

Make sure to go through this scenario with all the newly added words.

### Expected result:

After dialog is closed, the editor is focused and the searched-for text is selected.

### Unexpected:

After dialog is closed, editor is not focused or there are errors in the console.
