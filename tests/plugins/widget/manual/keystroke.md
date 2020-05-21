@bender-tags: widget, bug, 4.14.1, 3998
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, sourcearea, widget

1. Open console in dev tools.

1. Place cursor inside editor.

1. Press <kbd>CTRL</kbd> and <kbd>Enter</kbd> key.

	### Expected

	Source mode is opened and no error appears in dev console.

	### Unexpected

	Error appears in dev console or source mode editor is not opened.

1. Place cursor inside editor.

1. Press <kbd>CTRL</kbd> and <kbd>Enter</kbd> key.

	### Expected

	Editor switches to WYSIWYG mode. No error appears in dev console.

	### Unexpected

	Error appears in dev console or WYSIWYG area is not opened.
