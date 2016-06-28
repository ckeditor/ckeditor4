@bender-tags: 4.5.10, tc, 14701, widget, accessibility
@bender-ui: collapsed
@bender-ckeditor-plugins: placeholder, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

## Aria label for placeholders

You need to enable screen reader for this test.

### Custom label (fake selection)

1. Put the selection in the paragraph, like so: `Placeholder:^`.
1. Press `right arrow` key twice, so that widget becomes focused.

**Expected:** Screen reader reads "selected: just example placeholder widget".
### Label in standard selection

1. Put the selection in the first line, like so: `^Placeholder:`.
1. Press `up arrow` key, so that screen reader will read whole line.

**Expected:** Screen reader reads "Placeholder: simple placeholder region". **However for JAWS**, due it's broken implementation it reads: "Placeholder: Group box simple placeholder, left bracket left bracket just example right bracket right bracket".

The reason for this is:
* Treads region role as a group box.
* Adds inner text at the end, so it's: "left bracket left bracket just example right bracket right bracket".
