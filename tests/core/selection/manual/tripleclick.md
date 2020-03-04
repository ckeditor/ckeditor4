@bender-tags: selection, 4.13.0, 4.14.0, bug, 3118, 3175, 3705
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, list, format, sourcearea, undo

1. Open console.

1. Select list item by triple clicking on it.

1. Pick `Heading 1` from format combo.

	### Expected:

	Heading is applied only to list item.

	### Unexpected:

	Paragraph after the list is turned into `h1`.

1. Start selection at the end of document and end it in the first line without selecting list item (<a href="https://user-images.githubusercontent.com/1061942/63528470-4b468f80-c503-11e9-9e95-af86e7622ad8.gif" target="_blank">see gif</a>).

1. Change format to `Heading 3`.

	### Expected:

	List item is still `h1`, the second paragraph is `h3`. There is no error in the console.

	### Unexpected:

	Style of list item changed or there is an error in the console.
