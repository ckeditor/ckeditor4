@bender-tags: 4.14.1, bug, 4008
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, removeformat, basicstyles

1. Focus the editor.
1. Press bold button.
1. Type `Hello,`.
1. Press remove format button.
1. Type `World!`

**Expected** Once remove button pressed, typed text in a plain text format.

**Unexpected** The whole typed text is bold, despite pressing remove format button.
