@bender-tags: selection, 4.15.0, bug, 4041
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, divarea, toolbar

1. Open browser dev console.
1. Press `Scroll Into View` button.

	### Expected

	No error appears in dev console.

	### Unexpected

	Error appears in dev console.

1. Place cursor at the end of `Welcome letter`.
1. Scroll to the end of editor.
1. Press cog button.

	### Expected

	You should be scrolled to `Welcome letter` text line.

	### Unexpected

	You are not scrolled to `Welcome letter` text line.
