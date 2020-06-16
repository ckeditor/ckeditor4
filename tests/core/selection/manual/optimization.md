@bender-tags: selection, 4.13.0, bug, 3161, 3175, 3493
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, list, undo, div, table, image, basicstyles, format

Play around with selection in both editors to check if there are no weird behaviours.

Switch to `source view` during testing few times to see if it doesn't affect the way selection works.

Check different ways to manipulate selection:
- Collapsed and non-collapsed selection with mouse
- Double click
- Triple click
- Arrow keys
- <kbd>Shift</kbd> + <kbd>Arrow</kbd>
- <kbd>Shift</kbd> + <kbd>Home</kbd> / <kbd>End</kbd>
- <kbd>Ctrl</kbd> / <kbd>Command</kbd> + <kbd>A</kbd>

Things to test:
- Single line selection
- Multiline selection
- Selection that starts/ends at the start/end of element.
