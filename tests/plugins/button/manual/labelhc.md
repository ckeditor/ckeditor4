@bender-tags: 4.16.0, 4422, bug, editor, button,
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, clipboard, format, stylescombo

**Note**: This test forces editor into High Contrast Mode.

1. Examine toolbar buttons.

**Expected**: There should be space between button name and keyboard shortcut.

**Unexpected**: Button keyboard shortcut description is glued to button name (no space in-between).
