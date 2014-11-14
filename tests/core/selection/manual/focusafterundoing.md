@bender-tags: selection, focus
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, floatingspace, undo

**Before starting:** Open the console.

----

1. Click inside the 1st editor to focus it.
	* `Editor 1: focus` should be logged once.
1. Type something.
1. Undo (check both - by keystroke and button).
	* Nothing should be logged.
	* There should be a blinking caret in the editor.
1. Click outside editor.
	* `Editor 1: blur` should be logged once.

----

1. Click inside the 2nd editor to focus it.
	* `Editor 2: focus` should be logged once.
1. Type something.
1. Undo (check both - by keystroke and button).
	* Nothing should be logged. Focus should not be lost.
	* There should be a blinking caret in the editor.
1. Click outside editor.
	* `Editor 2: blur` should be logged once.