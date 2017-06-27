@bender-tags: widget, feature, 4.7.3, 568
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, basicstyles, wysiwygarea, toolbar, elementspath, htmlwriter

## Editable disallowed content

For editor1 and editor2 do the following:

1. Put the selection inside the widget's editable.
	* **Expected editor1:** strikethrough, `sub` and `sup` buttons get disabled. Bold, italic, underline remains active.
	* **Expected editor2:** _All_ the basic styles except bold gets disabled.
1. Click outside of the widget, e.g. paragraph before the widget.
	* **Expected:** all basic styles buttons are active again.
