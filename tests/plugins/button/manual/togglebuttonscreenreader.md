@bender-tags: 4.19.0, 2444, feature, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

**Note** This test is intended for screen reader.

1. Move focus to the button in the editor's toolbar.

	**Expected** Screen reader announces the button as togglable and currently switched off/unpressed.
1. Activate the button via keyboard.
1. Move the focus back to the button.

	**Expected** Screen reader announces the button as togglable and currently switched on/pressed.
1. Activate the button via the keyboard.
1. Move the focus back to the button.

	**Expected** Screen reader announces the button as togglable and currently switched off/unpressed.

## Sample screen reader outputs

### VoiceOver on macOS

* off: "&lt;button name&gt;, toggle button"
* on: "&lt;button name&gt;, toggle button, selected"

### NVDA

* off: "&lt;button name&gt;, toggle button, not pressed"
* on: "&lt;button name&gt;, toggle button, pressed"

### JAWS

* off: "&lt;button name&gt;, toggle button"
* on: "&lt;button name&gt;, toggle button, pressed"
