@bender-ui: collapsed
@bender-tags: 4.13.1, bug, 875
@bender-ckeditor-plugins: floatingspace, basicstyles, wysiwygarea, tableselection, clipboard, undo, selectall, blockquote, sourcearea, div, htmlwriter

**Note:** As writing down all possible selections would make this test description really long,
after conducting test steps have some fun pasting in other ways than described and look for bugs
(e.g. using `div` plugin).

## For each editor:

1. Select word `Start` and copy it.

1. Press <kbd>Ctrl+A</kbd>.

1. Paste copied content.

	### Expected:

	The editor content have been replaced by pasted content.

	### Unexpected:

	Pasted data appeared in table, the rest of content is untouched.

1. Undo changes.

1. Select words `Before` and `First`, copy them.

1. Click `Select All` button on toolbar.

1. Paste copied content.

	### Expected:

	Editor source code is like below or similar (depending on exact selection you made):
	```
	<p><strong>Before</strong></p>

	<table border="1">
		<tbody>
			<tr>
				<td><strong>First</strong></td>
			</tr>
		</tbody>
	</table>
	```

	### Unexpected:

	Pasted data appeared in table, the rest of content is untouched.

1. Undo changes.

1. Create selection starting at word `nesting` and ending in the cell with the word `Middle` and copy it.

1. Select all content in any way, paste content.

	### Expected:

	Editor source code is like below or similar (depending on exact selection you made):
	```
	<p>nesting</p>

	<table border="1" cellpadding="1" cellspacing="1" style="width:100%">
		<tbody>
			<tr>
				<td><strong>Left</strong></td>
				<td><strong>Middle</strong></td>
			</tr>
		</tbody>
	</table>
	```

	### Unexpected:

	Pasted data appeared in table, the rest of content is untouched.

1. Undo changes.

1. Select word `Before` and copy it.

1. Select table cells with words `First` and `Second` and paste.

	### Expected:

	The first cell contains word `Before`, the second one is empty.

	### Unexpected:

	There is only one cell in the row or whole table content was replaced.
