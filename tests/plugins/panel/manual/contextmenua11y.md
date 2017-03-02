@bender-tags: 4.7.0, tc, 16804
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,elementspath,floatpanel,panel,menu,contextmenu,clipboard,a11yhelp,table,tabletools

### Test Scenario

1. Focus the editor and press `Ctrl + Shift + F10` to open the context menu.
2. Navigate through the menu.

#### Expected

In each opened menu or submenu the first active element is focused.

#### Unexpected

The first element is not focused.
