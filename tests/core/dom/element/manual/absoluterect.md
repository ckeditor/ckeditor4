@bender-ui: collapsed
@bender-tags: 4.10.0, feature, 1724
@bender-ckeditor-plugins: wysiwygarea,toolbar

Use scrollbar to change scroll position of the editor. You should use both vertical and horizontal scrollbars.

## Expected

You should observe changing properties on scroll:

Vertical editor scroll: top, bottom, y

Horizontal editor scroll: left, right, x

## Unexpected

Mentioned properties doesn't change on scroll.

***Note:*** `x` and `y` properties are not available for IE or Edge browsers.
