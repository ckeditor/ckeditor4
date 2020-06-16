@bender-tags: 4.10.0, bug, 2018
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, textwatcher

1. Focus the editor.
1. Use all of the listed movement keys to change cursor position inside editor between `@` characters. Repeat with modifier keys `cmd`, `ctrl`, `option` e.g. `ctrl+leftArrow`.
1. See history output (above the editor).

**Movement keys:**

* `arrowLeft`
* `arrowRight`
* `arrowUp`
* `arrowDown`
* `end`
* `home`
* `pageUp`
* `pageDown`

## Expected

No `textwatcher` checks logged inside history output.

## Unexpected

Any `textwatcher` check logged into history output.

**Other details** If you use different keys than listed above the editor you may see logged checks inside history output.
