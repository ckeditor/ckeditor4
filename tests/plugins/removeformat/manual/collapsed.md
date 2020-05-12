@bender-tags: 4.11.4, bug, 4008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, removeformat, basicstyles

1. Place selection at the end of the text - `Hello,^`.
1. Press remove format button.
1. Type `World!`.

**Expected** Typed text is a plain text.

**Unexpected** Typed text is bolded.
