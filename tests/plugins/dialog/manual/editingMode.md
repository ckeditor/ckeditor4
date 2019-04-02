@bender-tags: dialog, 4.12.0, 2423, feature, dialog
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

# Dialog editing

Use debug box above the editors to understand whether the editor implements correctly edit/create mode recognition.

1. Focus the first (blank) line of the first editor.
1. Use "link" button to open link creation dialog.

	## Expected

	Debug box says that dialog is in **creation** mode.

	## Unexpected

	Debug box says that dialog is in **editing** mode.

1. Close the dialog.

---

1. Focus the first editor.
1. Put the selection in the first link in the second line.
1. Use "link" button to open link properties dialog.

	## Expected

	Debug box says that dialog is in **editing** mode.

	## Unexpected

	Debug box says that dialog is in **creation** mode.

1. Close the dialog.

---

Repeat above steps for other features like placeholders, anchors, tables.

Also repeat for the second (inline) editor.
