@bender-ui: collapsed
@bender-tags: 4.13.1, bug, 875
@bender-ckeditor-plugins: toolbar, floatingspace, basicstyles, wysiwygarea, tableselection, clipboard, undo, elementspath, selectall

## For each editor:

1. Select **bolded** content ('Test' + first table cell) and copy it.

1. Press <kbd>Ctrl+A</kbd>.

1. Paste copied content.

	### Expected:

	The editor content have been replaced by pasted content.

	### Unexpected:

	Pasted data appeared in table, the rest of content is untouched.

1. Undo changes.

1. Select unbolded content (second table cell + 'Test2') and copy it.

1. Click `Select All` button on toolbar.

1. Paste copied content.

	### Expected:

	The editor content have been replaced by pasted content.

	### Unexpected:

	Pasted data appeared in table, the rest of content is untouched.
