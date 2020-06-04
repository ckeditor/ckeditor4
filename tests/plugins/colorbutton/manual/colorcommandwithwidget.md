@bender-tags: feature, 4.14.0, 3306
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, basicstyles, table, tableselection, list, sourcearea, elementspath, htmlwriter, undo, colordialog
@bender-ui: collapsed

## Test case 1:
1. Move caret in different position inside text.
2. Verify if color buttons change state according to current selection.
3. Switch to readonly mode

### Expected:
* Color button state is ON, when color panel is open. Regardless of current selection.
* When color panel is closed:
  * Color button state is ON, when selection is inside text with proper style
  * Color button state is OFF, when selection is outside of text with proper style
* Color button state is DISABLED, when editor is in readonly mode

### Unexpected:
* Color button state is not coherent with state in the editor.

## Test case 2:
1. Move caret to the widget. (If there is no widget add new one with the empty button in the toolbar).
2. Move caret inside each of 3 rows inside widget and check ui state.

### Expected:
* in 1st row color buttons are disabled - only paragraph element is allowed
* in 2nd row textColor button is enbaled and backgroundColor button is disabled - only paragraph and span{color} is allowed
* in 3rd row both collor buttons are enabled - there is no restriction to the editable content

### Unexpected:
* Color buttons are enabled in wrong sections
