@bender-tags: 4.15.1, bug, 848
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, divarea, floatingspace

1. Copy the following text: عام
1. For each editor:
	1. Focus editor.
	1. Paste copied text 3 times.

## Expected result

The pasted text is merged into single entity عامعامعام.

## Unexpected

3 separate words are inserted like عام عام عام (with or without spaces in-between).
