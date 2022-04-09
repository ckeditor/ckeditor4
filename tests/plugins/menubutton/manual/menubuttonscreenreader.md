@bender-tags: 4.19.0, 2444, feature, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language

**Note** This test is intended for screen reader.

1. Move focus to the button in the editor's toolbar.

	**Expected** Screen reader announces the button as having popup and currently collapsed.
1. Activate the button via keyboard.

	**Expected** Screen reader announces the menu.
1. Press <kbd>Escape</kbd>.

	**Expected** Screen reader announces the button as having popup and currently collapsed.

## Sample screen reader outputs

### VoiceOver on macOS

* button: "&lt;button name&gt;, menu pop-up collapsed, button"
* menu: ("plop" sound) "&lt;first item name&gt; you are currently in the menu"

### NVDA

* button: &lt;button name&gt; button collapsed submenu
* menu: ("beep" sound) "&lt;first item name&gt; not checked 1 of 3"

### JAWS

* off: "&lt;button name&gt;, button menu. Press space to activate the menu, then navigate with arrow keys"
* menu: "Menu, &lt;first item name&gt; not checked 1 of 3. To move through items press up and down arrow"
