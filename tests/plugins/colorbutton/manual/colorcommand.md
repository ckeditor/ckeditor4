@bender-tags: feature, 4.14.0, 3306
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, basicstyles, table, tableselection, list, sourcearea, elementspath, htmlwriter, undo, colordialog
@bender-ui: collapsed

1. Try to apply and remove text and background colors on text.
2. You can create additional elements like list, tables, basicstyles etc. and try to apply colors with them.

### Expected:
* Each color change has information in the red box below the editor, about type of the command, and style which is applied or removed.
* Visual representation in box with black-yellow dashes changes according to last command changes.

### Unexpected:
* Text or background color change is not applied.
* There is no related information or visual representation change.
