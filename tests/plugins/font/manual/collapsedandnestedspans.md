@bender-tags: 4.14.0, feature, 1306, 3728
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, notification

1. Make collapsed selection inside unstyled text.
2. Observer "elementspath".
3. Try to apply the same font/fontSize multiple time.
4. Try to apply different font/fontSize each time.

## Expected:
There is created only one span with new style. There is no new spans inside element's path.

## Unexpected:
There are created multiple spans after each click into font/fontSize combo.
