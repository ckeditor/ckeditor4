@bender-tags: 4.5.10, tc, 14701, widget, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

## Aria label for widgets

You need to enable screen reader for this test.

### Custom label (fake selection)

1. Put the selection in the first line, like so: `Image with alt:^`.
1. Press `right arrow` key twice, so that widget becomes focused.

**Expected:** Screen reader reads "selected: foo image widget".

### Default label (fake selection)

1. Put the selection in the last line, like so: `Image with empty alt:^`.
1. Press `right arrow` key twice, so that widget becomes focused.

**Expected:** Screen reader reads "selected: image widget".

Repeat the procedure for the last paragraph.

### Label in standard selection

1. Put the selection in the first line, like so: `^Image with alt:`.
1. Press `up arrow` key, so that screen reader will read whole line.

**Expected:** Screen reader reads "Image with alt: foo image widget". **However for JAWS**, due it's broken implementation it reads: "Image with alt: Group box foo image widget, graphic foo".

The reason for this is:
* Treads region role as a group box.
* Adds inner content at the end, so it's: "graphic foo".
