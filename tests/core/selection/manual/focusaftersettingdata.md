@bender-tags: selection, focus, tc, 4.4.6, 12630, 12337
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea

**Before starting:** Open the console.

----

1. Click inside the 1st editor to focus it.
	* `Editor 1: focus` should be logged once.
1. Wait for data change (2s).
	* Nothing should be logged.
	* The caret should be blinking in the editor.
1. Click outside the editor.
	* `Editor 1: blur` should be logged once.

----

1. Click inside the 2nd editor to focus it.
	* `Editor 2: focus` should be logged once.
1. Wait for data change (2s).
	* Nothing should be logged.
	* The caret should be blinking in the editor.
1. Click outside the editor.
	* `Editor 2: blur` should be logged once.
