@bender-tags: bug, 4.11.0, 1451
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,contextmenu,clipboard,table,tableselection,floatingspace

## For each editor:

1. Scroll page so editor as at the top.
1. Select some editor content with mouse or keyboard.
1. Press <kbd>Shift</kbd> + <kbd>F10</kbd> to open context menu from keyboard.

### Expected

#### Left to right editors:
- The panel shows itself on the right side of selection.

#### Right to left editors:
- The panel shows itself on the left side of selection.

## Additional checks for Firefox

* Check if menu can be opened using mouse after opening it using keyboard.
* Check if subsequent pressing <kbd>Shift</kbd> + <kbd>F10</kbd> also opens menu.

### Note:

IE8: There is known bug [#549](https://github.com/ckeditor/ckeditor4/issues/549) with wrong context menu position in inline editors.
