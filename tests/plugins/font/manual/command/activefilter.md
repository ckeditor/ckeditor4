@bender-tags: feature, 4.14.0, 3728
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, basicstyles, table, tableselection, list, sourcearea, elementspath, htmlwriter, undo
@bender-ui: collapsed

## Test Case 1:
1. Move caret to the widget. (If there is no widget add new one with the empty button in the toolbar).
2. Move caret inside each of 3 rows inside widget and check UI state.

### Expected:
* in 1st row font and fontSize buttons are disabled - only paragraph element is allowed
* in 2nd row fontSize button is enbaled and font button is disabled - only paragraph and span{font-size} is allowed
* in 3rd row both font and fontSize buttons are enabled - there is no restriction to the editable content

### Unexpected:
* Font or fontSize buttons are enabled in wrong sections

## Test Case 2:
1. Have sure that widget is present in the editor. If not create one.
2. Turn on readOnly mode.
3. Move care inside editor and widget

### Expected:
* Font and fotnSize buttons are disabled when editor is readOnly mode regardles of selection position.
