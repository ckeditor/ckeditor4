@bender-tags: 4.7.2, justify, bug, 455
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, justify, wysiwygarea, elementspath, sourcearea

## Justification disabling on disallowedContent rule

General note: CKEditor config **disallows** only on justification in `<h1>` element.

----
1. Select entire text.
1. Change justification

**Expected:** Justification should only applied to 1st, 3rd and 5th line. 2nd and 4th should remain untouched.

----
1. Move caret to 2nd line (word "Bar").

**Expected:** Justification option should be disabled and you should not be allowed to justify list item.

----
**Unexpected:**
* Justification is possible to change when caret is inside forbidden element.
* Justification buttons are not visible in editor.
