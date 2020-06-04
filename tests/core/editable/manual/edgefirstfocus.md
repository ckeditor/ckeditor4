@bender-tags: 4.13.0, bug, 504
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, floatingspace, basicstyles

## Test scenario

For each editor:
1. Scroll it without focusing.
2. Click into content to focus the editor.

## Expected result

* Scroll position remains unchanged.
* Caret is placed exactly where the click ocurred.

## Unexpected

* Editor scroll position is moved to top.
* Caret is placed at the beginning of the editor's content.
