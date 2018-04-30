@bender-tags: 4.10.0, bug, 498
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, iosscroll, sourcearea, toolbar, basicstyles

## Test scenario #1

1. Scroll page down until editable is on top of view.
1. Put focus caret in any line of editable content. Check especially typing into the super long paragraph.
1. Start typing with on screen keyboard using letter keys and auto-complete.

### Expected result

The edited line is scrolled to the top of the editor.

### Unexpected result

Editable is scrolled down and caret is not visible and typed letters are not visible.

Note: Flickering or scroll jump could occur at the start of typing.

## Test scenario #2

1. Switch to source mode and back to WYSIWYG mode.
2. Check if test scenario #1 is still working.

### Expected result

After switching back to WYSIWYG mode, everything still works correctly.

### Unexpected result

Editable is scrolled down and caret is not visible and typed letters are not visible.
