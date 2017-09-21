@bender-tags: 4.5.10, bug, trac14539, widget, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

## Aria label for widgets

You need to enable screen reader for this test.

### Custom label (fake selection)

1. Put the selection in the first line, like so: `Element without classes:^ This is inner text`.
1. Press `right arrow` key twice, so that widget becomes focused.

**Expected:** Screen reader reads "selected: fancy widget".

### Default label (fake selection)

1. Put the selection in the last line, like so: `This widget doesn't implement path:^ foo`.
1. Press `right arrow` key twice, so that widget becomes focused.

**Expected:** Screen reader reads "selected: em widget".

### Label in standard selection

1. Put the selection in the first line, like so: `^Element without classes: This is inner text`.
1. Press `up arrow` key, so that screen reader will read whole line.

	**Expected:** Screen reader reads "Element without classes: Fancy widget region". **However for JAWS**, due it's broken implementation it reads: "Element without classes: Group box Fancy widget, This is inner text".

	The reason for this is:
	* Treads region role as a group box.
	* Adds inner text at the end, so it's: "This is inner text".
