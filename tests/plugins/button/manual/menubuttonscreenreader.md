@bender-tags: 4.19.1, 5144, bug, button
@bender-ui: collapsed

**Note** This test is intended for screen reader.

1. Select some text in the editor.
1. Move focus to the first button in the editor's toolbar.

	**Expected** Screen reader announces the button and optionally informs it's collapsed.
1. Apply color or language to the selected text.
1. Move the focus back to the button.

	**Expected** Screen reader announces the button and optionally informs it's collapsed.

	**Unexpected** Screen reader announces the button as expanded.
1. Repeat it for the other button.

## Sample screen reader outputs

### VoiceOver on macOS

* "&lt;button name&gt;, menu pop-up collapsed, button"

### NVDA

* "&lt;button name&gt;, button, collapsed, submenu"

### JAWS

* "&lt;button name&gt;, button menu"
