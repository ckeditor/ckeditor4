@bender-tags: 4.7.0, bug, trac16804
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,elementspath,floatpanel,panel,richcombo,dialog,colordialog,button,panelbutton,stylescombo,font,colorbutton,a11yhelp

### Scenario 1

1. Use the keyboard shortcut `Alt + F10` to focus the toolbar. Navigate through the toolbar using `Tab` and `Shift+Tab`.
2. For each toolbar element use the `down arrow` key to open a panel.

#### Expected

When opening a panel its first(or topmost) element is focused.

#### Unexpected

The first element is not focused.

### Scenario 2

1. Type some text, change its font size, font name, paragraph format, color, background, style.
1. Use the keyboard shortcut `Alt + F10` to focus the toolbar. Navigate through the toolbar using `Tab` and `Shift+Tab`.
2. For each toolbar element use the `down arrow` key to open a panel.

#### Expected

When opening a panel the item reflecting the content's style is focused.

#### Unexpected

The focused element does not match the content's style(e.g. Font size 8 is focused when the size of the text is 16).
