@bender-tags: 4.13.1, bug, widget, 3352
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, undo, selectall

1. Select all inside the editor. **DO NOT** release keys.
2. Check counter of selected widgets.

	## Expected

	The number equals the number of widgets inside the editor.

	## Unexpected

	The number is different than the number of widgets inside the editor.
2. Cut/copy **without releasing keys** between this and the previous step.
3. Check counter of copied/cut widgets.

	## Expected

	The number equals the number of widgets inside the editor.

	## Unexpected

	The number is different than the number of widgets inside the editor.
