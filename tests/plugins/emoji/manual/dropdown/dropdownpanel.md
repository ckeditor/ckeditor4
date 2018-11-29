@bender-tags: 4.11.2, bug, emoji, 2594
@bender-ckeditor-plugins: wysiwygarea, toolbar, elementspath, sourcearea, undo, emoji, clipboard, undo, stylescombo, format
@bender-ui: collapsed
@bender-include: ../../_helpers/tools.js

# Desktop browsers

1. Open The Emoji Panel.
1. Resize browser horizontally.

## Expected

- The panel should move around together with button.
- When the panel doesn't fit on the right side of button it should flip to the left.

## Unexpected

- The panel flickers.
- The panel closes.

# Mobile browsers

1. Open The Emoji Panel.
1. Click on `Nature and Animals` category.
1. Focus search field.

## Expected

- The Emoji Panel is visible all the time after step 1.

## Unexpected

- Emoji Panel hides and shows again at least once at any of given steps.
