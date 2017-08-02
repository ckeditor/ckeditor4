@bender-ui: collapsed
@bender-tags: bug, 710, 4.7.2
@bender-ckeditor-plugins: autogrow, wysiwygarea, toolbar, floatingspace, tableselection, image2

## Case 1

**Procedure:**

1. Click widget.

**Expected result:**

Widget stays focused.

**Actual result:**

Widget immediately loses focus.

## Case 2

1. Try to resize image.

**Expected result:**

Image is resized.

**Actual result:**

Image is resized, but table selection is activated at the same time.

## Case 3

1. Try to move image to another cell

**Expected result:**

Image is moved.

**Actual result:**

Nothing happens.
