@bender-ui: collapsed
@bender-tags: 4.17.0, 4604, feature, clipboard
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

## Scenario 1:

Paste image from the clipboard into the editor.

**Expected**: The message above the editor says "File pasted" on the green background.

Note: image will be actually inserted into the editor only in Firefox!

## Scenario 2:

Paste non-file content (e.g. text) into the editor.

**Expected**: The message above the editor says "Non-file pasted" on the red background.

## Scenario 3:

Drop image or some other file into the editor.

**Expected**: The message above the editor says "File pasted" on the green background.

Note: image will be actually inserted into the editor only in Firefox! File won't be inserted at all.

## Scenario 4:

Drop non-file content (e.g. text) into the editor.

**Expected**: The message above the editor says "Non-file pasted" on the red background.
