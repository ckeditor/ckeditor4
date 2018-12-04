@bender-tags: 4.11.2, bug, emoji, 2594
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, emoji
@bender-ui: collapsed
@bender-include: ../../_helpers/tools.js

# For both editors

## Desktop browsers

1. Open The Emoji Panel.
1. Resize browser horizontally. Check expected before going to step 3.
1. Press button `X` on side panel. Next to `Test steps` and repeat steps 1-2.

### Expected

- The panel should move around together with button.
- When the panel doesn't fit on one side of button (vertical or horizontal) it flips to the other side.
- On Edge and IE resizing browser blurs panel, so you need to reopen after each resize.

### Unexpected

- The panel flickers.
- The panel closes.

## Mobile browsers

1. Open The Emoji Panel.
1. Click on `Nature and Animals` category.
1. Focus search field.

### Expected

- The Emoji Panel is visible all the time after step 1.

### Unexpected

- Emoji Panel hides and shows again at least once at any of given steps.
