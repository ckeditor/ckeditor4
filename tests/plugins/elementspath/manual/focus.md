@bender-ui: collapsed
@bender-tags: 4.11.0, 438, bug
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, elementspath

## Focusing toolbar

1. Focus the editor.
1. Focus elements path by pressing `ALT + F11`.
1. Press `ALT + F10`.

## Expected

Toolbar is focused.

## Unexpected

Toolbar is not focused.

## Focusing editor

1. Focus the editor.
1. Focus elements path by pressing `ALT + F11`.
1. Press `ALT + F11` again.

## Expected

Focus toggles between toolbar and editor.

## Unexpected

Editor is not focused after second keystroke press.
