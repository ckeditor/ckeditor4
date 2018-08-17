@bender-ui: collapsed
@bender-tags: bug, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, list, indentlist, liststyle, undo

1. Put the caret inside bolded list item, like so: `a^a`.
1. Use "Copy Formatting" button.
1. Drag the selection inside of second list, like so:

		[dd
		ee
		ff]

### Expected

* `ol[start]` attribute is removed
* `strong` is applied to all three list items
