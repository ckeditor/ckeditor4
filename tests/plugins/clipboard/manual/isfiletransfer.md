@bender-ui: collapsed
@bender-tags: 4.17.0, 4604, feature, clipboard
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

## Scenario 1:

1. Paste image from the clipboard into the editor.

	### Expected:

	* The message above the editor says "File pasted" on the green background.

Notes:
* Test does _not_ require the image to be actually inserted into the editor.
* IEs could ignore pasting in such a case.

## Scenario 2:

1. Paste non-file content (e.g. text) into the editor.

	### Expected:

	* The message above the editor says "Non-file pasted" on the red background.

## Scenario 3:

1. Drop image or some other file into the editor.

	### Expected:

	* The message above the editor says "File pasted" on the green background.

Notes:
* Test does _not_ require the image nor file to be actually inserted into the editor.

## Scenario 4:

1. Drop non-file content (e.g. text) into the editor.

	### Expected:

	* The message above the editor says "Non-file pasted" on the red background.
