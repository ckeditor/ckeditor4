@bender-tags: feature, 4.13.0, 3306
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, basicstyles, table, tableselection, list, sourcearea, notification
@bender-ui: collapsed

1. Try to apply and remove colors from text.
2. You can create additional elements like list, tables, basicstyles etc. and try to apply colors with them.

### Expected:
* Each color change shows notification in editor and console, that appropriate command was run.

### Unexpected:
* Text or background color change is not applied.
* There is no related notification aboute execution a command.
