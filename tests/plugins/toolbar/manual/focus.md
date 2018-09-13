@bender-ui: collapsed
@bender-tags: 4.11.0, 438, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, elementspath

## Focusing elements path

1. Focus the editor.
1. Focus toolbar by pressing `ALT + F10`.
1. Press `ALT + F11`.

## Expected

Elements path is focused.

## Unexpected

Elements path is not focused.

## Focusing editor

1. Focus the editor.
1. Focus elements path by pressing `ALT + F11`.
1. Press `ALT + F11` again.

## Expected

Focus toggles between elements path and editor.

## Unexpected

Editor is not focused after second keystroke press.
