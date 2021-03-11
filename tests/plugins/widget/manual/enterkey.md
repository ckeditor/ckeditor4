@bender-tags 4.17.0, feature, 4467
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, image2, contextmenu, undo

1. Focus the first (block) widget.
1. Press <kbd>ENTER</kbd>.

  **Expected:** Widget dialog was opened.

  **Unexpected:** New paragraph was inserted or nothing happened.

1. Close dialog.
1. Focus the second (inline) widget.
1. Press <kbd>ENTER</kbd>.

  **Expected:** Widget dialog was opened.

  **Unexpected:** New paragraph was inserted or nothing happened.
