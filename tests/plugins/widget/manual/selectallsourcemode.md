@bender-tags: 4.13.1, bug, widget, 3704
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, undo, selectall

1. Open console.
2. Switch to source mode.
3. Type anything.

	## Expected

	Everything works just fine.

	## Unexpected

	There are errors in the console: `Uncaught TypeError: Cannot read property 'getSelectedElement' of null`
4. Switch back to WYSIWYG.
5. Select all.
6. Check counter of selected widgets.

	## Expected

	The number equals the number of widgets inside the editor.

	## Unexpected

	The number is different than the number of widgets inside the editor.
7. Copy/cut.
8. Check counter of copied/cut widgets.

	## Expected

	The number equals the number of widgets inside the editor upon copy/cut.

	## Unexpected

	The number is different than the number of widgets inside the editor.
