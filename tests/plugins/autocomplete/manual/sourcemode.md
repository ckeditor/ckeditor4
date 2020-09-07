@bender-tags: 4.15.0, bug, 4107
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, mentions, sourcearea

1. Switch to source mode.
1. Switch back to WYSIWYG mode.
1. Focus the editor.
1. Type `@` to open completion panel.
1. Navigate through items using arrow keys.
1. Close completion panel using `esc` key.
1. Type `#` to open completion panel.
1. Navigate through items using arrow keys.

## Expected

For both completion panels under `@` and `#` characters, you should be able to navigate through items using arrow keys.

## Unexpected

Navigation keys doesn't work for both or one of completion panels after toggling source mode.
