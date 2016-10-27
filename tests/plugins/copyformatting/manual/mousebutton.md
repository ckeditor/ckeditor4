@bender-ui: collapsed
@bender-tags: tc, copyformatting, 4.6.0
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace

**Procedure**

1. Put caret inside "Apollo 11" string like so: Apo^llo 11.
2. Click on "Copy formatting" button.
3. Click on unstyled word (e.g. "landed") using the middle mouse button.
4. Repeat the procedure, but instead of the middle mouse button, use the right mouse button.

**Expected**

Editor doesn't do any action, standard browser scrolling kicks in.

**Unexpected**

The word where cursor is gets styled.

