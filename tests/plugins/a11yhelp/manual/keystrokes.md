@bender-tags: bug, 4.11.0, 2519
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, a11yhelp, link

1. Focus the editor.
1. Open Accessibility Help using `ALT+0` hotkey.
1. Scroll down to `Commands` section.

## Expected

Link command is described by two keystrokes

* `CTRL+K / CTRL+L` (Windows/Linux)
* `Command+K / Command+L` (MacOS)

## Unexpected

Link command is described by a single keystroke

* `CTRL+L`. (Windows/Linux)
* `Command+L`. (MacOS)
