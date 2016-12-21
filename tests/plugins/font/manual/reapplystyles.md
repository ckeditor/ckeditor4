@bender-tags: 4.6.2, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, enterkey, elementspath, basicstyles

## Scenario 1

1. Place caret on the beginning of the text.
1. Change font family using Font dropdown.
1. Type something.

## Scenario 2

1. Place caret in the middle of the text.
1. Change font family using Font dropdown.
1. Type something.

## Scenario 3

1. Place caret on the end of the text in the way that existing styles are recognized.
1. Change font size using Size dropdown.
1. Type something.

### Expected:
Styles are preserved and typed text is styles as rest of the text (except the one changed style).

### Unexpected:
Some styles are lost after changing font family/size. Typed text is styled differently
(except the one changed style) than the rest of the text.

