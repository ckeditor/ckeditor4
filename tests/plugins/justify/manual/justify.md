@bender-tags: 4.7.0, tc, 16808, justify
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea

## Justification disabling on disallowed content

Note: CKEditor config allows only on justification in paragraphs `<p>`.

----
1. Put caret inside pargraph ("Foo" word).
1. Change alignment option.

**Expected:** Justification buttons should be possible to press and alignment change accorind to your selecitons.

----
3. Move caret to list item `<li>` (e.g. word "One").

**Expected:** Justification option should be disabled and you should not be allowed to justify list item.

----
**Unexpected:** Justification is possible to change when caret is inside list item.

**Unexpected:** Justification buttons are not visible in editor.
