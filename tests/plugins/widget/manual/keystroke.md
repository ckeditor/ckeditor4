@bender-tags: widget, bug, 4.14.1, 3998
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, widget

1. Open browser dev console.

1. Place cursor inside editor.

1. Press <kbd>CTRL</kbd> + <kbd>Enter</kbd> key.

	### Expected

	Source mode is opened and no error appears in dev console.

	### Unexpected

	Error appears in dev console or source mode is not opened.

1. Place cursor inside editor.

1. Press <kbd>CTRL</kbd> + <kbd>Enter</kbd> key.

	### Expected

	Editor switches to WYSIWYG mode. No error appears in dev console.

	### Unexpected

	Error appears in dev console or WYSIWYG mode is not opened.
