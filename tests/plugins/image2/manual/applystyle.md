@bender-tags: 4.10, feature, 1566
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2, link, sourcearea, undo
@bender-include: ../../widget/_helpers/tools.js

Testing integration of `CKEDITOR.style` with `image2` widgets

# Notes for tester:

* Start with focusing widget. Area below widget will display focused widget `styleDefinition` and `data`.
* If no widget is focused output will present registered widget with lowest id.
* Buttons with no icons will add/remove styles just as button label says:
	- Border is styled via inline styles,
	- Font is styled via CSS classes.
* Test adding/removing various styles to widget.
* Test if styles are preserved after copy/paste.
* Test if styles are preserved after going into and back from `sourcemode`.
* Test undo integration.
