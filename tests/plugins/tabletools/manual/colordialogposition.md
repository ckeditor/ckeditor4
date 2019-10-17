@bender-tags: 4.13.1, bug, 3559
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, undo, colorbutton, colordialog, link, image

1. Open color dialog for text in cell 1.1.

1. Change dialog position and text color.

1. Open cell properties dialog for any cell.

1. Open dialog to change cell background color.

  ### Expected:
    * Color dialog is on top of cell properties and you can use it.

    * It appeared in the place it was closed before.

    * Cell properties dialog is faded and unaccessible.

  ### Unexpected:
  Color dialog appeared behind cell properties dialog or is unaccessible for any other reason.

1. Change background color to blue (e.g. `#0000ff`) and border color to red (e.g. `#ff0000`) and close dialogs.

  ### Expected:
  Dialogs are properly hidden and both colors are applied.

  ### Unexpected:
  Any dialog doesn't disappear and makes editor unavailable.

1. Using console check also independent dialogs ordering, e.g. type:
```
CKEDITOR.instances.editor.execCommand( 'link' );
CKEDITOR.instances.editor.execCommand( 'colordialog' );
CKEDITOR.instances.editor.execCommand( 'link' );
```

  ### Expected:
  Link dialog is on top and interactive, color dialog is behind cover.

  ### Unexpected:
  Link dialog didn't move ahead of color dialog.
