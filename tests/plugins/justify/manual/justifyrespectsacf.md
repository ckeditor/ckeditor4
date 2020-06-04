@bender-tags: 4.7.2, justify, bug, 455
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea, elementspath

## Justification disabled on filtered content.

General Note: CKEditor config allows only on justification in paragraphs `<p>`.

----
1. Put caret inside pargraph ("Foo" word).
1. Change alignment option.

**Expected:** Justification buttons should be possible to press and alignment change accorind to your selecitons.

----
1. Move caret to list item `<li>` (e.g. word "One").

**Expected:** Justification option should be disabled and you should not be allowed to justify list item.

----
1. Select all text
1. Change alignment.

**Expected:** Aligned is only first paragraph, list remain in this same position.

----
**Unexpected:**
* Justification is possible to change when caret is inside list item.
* Justification buttons are not visible in editor.
