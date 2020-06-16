@bender-tags: 4.14.0, 4.6.2, bug, trac14856
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, basicstyles

## Scenario 1

1. Place caret at the beginning of the text.
1. Change font family using Font dropdown.
1. Type something.

## Scenario 2

1. Place caret in the middle of the text.
1. Change font family using Font dropdown.
1. Type something.

## Scenario 3

1. Place caret at the end of the text so that existing styles are recognized.
1. Change font size using Size dropdown.
1. Type something.

### Expected:
Styles are preserved and typed text is styled in the same way as the rest of the text (with the exception of the styles that were changed).

### Unexpected:
Some styles are lost after changing font family/size. Typed text is styled differently
(except the one changed style) than the rest of the text.

