@bender-tags: 4.10.0, bug, 498
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea

## Test scenario

For each editor:
1. Scroll page down until editable is on top of view.
1. Put focus caret in first line of editable content.
1. Start typing with on screen keyboard using letter keys and auto-complete.

## Expected result

Editable is scrolled in a way caret is visible and user can see what is typing.

## Unexpected

Editable is scrolled down and caret is not visible and typed letters are not visible.

Note: Flickering occurs when typing.
