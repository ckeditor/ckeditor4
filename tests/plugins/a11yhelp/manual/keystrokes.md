@bender-tags: bug, 4.11.0, 2519
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, a11yhelp, link

1. Focus the edtior.
1. Open Accessibility Help using `ALT+0` hotkey.
1. Scroll down to `Commands` section.

## Expected:

### Windows/Linux

Link command is described by two keystrokes: `CTRL + L / CTRL + K`.

### MacOS

Link command is described by two keystrokes: `Command + L / Command + K`.

## Unexpected

### Windows/Linux

Link command is described by a single keystroke: `CTRL + L`.

### MacOS

Link command is described by a single keystroke: `Command + L`.
