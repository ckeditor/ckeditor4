@bender-tags: selection, focus, bug, 4.4.6, trac12630, trac12337
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea

**Before starting:** Open the console.

----

1. Click "Focus editor 1" button.
2. Expected:
	* The caret should be blinking in the editor.
	* The last two logged messages should be:
		* `Editor 1: focus`.
		* `Selection in editor 1: h1`.

----

1. Click "Focus editor 2" button.
2. Expected:
	* The caret should be blinking in the editor.
	* The last two logged messages should be:
		* `Editor 2: focus`.
		* `Selection in editor 2: h1`.
