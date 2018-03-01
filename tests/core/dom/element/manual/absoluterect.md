@bender-ui: collapsed
@bender-tags: 4.10.0, feature, 1724
@bender-ckeditor-plugins: wysiwygarea,toolbar

Use scrollbar to change scroll position of the browser and the editor. You should use both vertical and horizontal scrollbars.

## Expected

You should observe changing properties on scroll:

Vertical browser scroll: y

Horizontal browser scroll: x

Vertical editor scroll: top, bottom, y

Horizontal editor scroll: left, right, x

## Unexpected

Mentioned properties doesn't change on scroll.
