@bender-tags: 4.7.2, justify, bug, 455
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, divarea, elementspath

## Justification disabled on filtered content.

General Note: CKEditor config allows only on justification in `<div>` elements.

----
1. Put caret inside text.

**Expected:** Justification buttons should be possible to press and no alignment option is chosen.

----
1. Press one of the justification buttons.

**Expected:** Pressed option should be chosen and new `<div>` element should be inserted into the editor.

