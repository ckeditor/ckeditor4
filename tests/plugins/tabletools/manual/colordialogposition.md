@bender-tags: 4.13.1, bug, 3559
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, undo, colorbutton, colordialog, link, image

1. Select the first cell text.

1. Open color dialog by clicking the color button and choosing more colors option.

1. Choose a random color.

1. Change dialog position and confirm changes.

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

1. Click the buttons above the editor (one time each).

1. Start closing dialogs to verify their order.

  ### Expected:
  Dialogs are displayed in the right order and each one can be closed properly.

  ### Unexpected:
  After clicking any button or closing any dialog the rest is behind the dialog cover.
